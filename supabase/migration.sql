-- Qom International Relations — Admin Panel schema
-- Run this once in the Supabase SQL Editor (Project → SQL Editor → New query),
-- then click "Run". Safe to re-run (uses IF NOT EXISTS / OR REPLACE throughout).

-- 1) Staff profiles ---------------------------------------------------------
-- One row per staff member, linked 1:1 to a Supabase Auth user.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles: self read" on public.profiles;
create policy "profiles: self read" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles: admins read all" on public.profiles;
create policy "profiles: admins read all" on public.profiles
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

drop policy if exists "profiles: admins manage" on public.profiles;
create policy "profiles: admins manage" on public.profiles
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Automatically create a profile row whenever a new Auth user is created
-- (e.g. via an admin invite). First-ever user becomes admin automatically.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    case when (select count(*) from public.profiles) = 0 then 'admin' else 'editor' end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2) Content items -----------------------------------------------------------
-- One flexible table for News, Statements/Messages, Events and Media
-- (photos/videos/documents), distinguished by `type`.
create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('news', 'statement', 'event', 'photo', 'video', 'document')),
  category text not null default '',
  title_en text not null default '',
  title_ar text not null default '',
  excerpt_en text not null default '',
  excerpt_ar text not null default '',
  body_en text not null default '',
  body_ar text not null default '',
  image_url text,
  media_url text,
  event_date date,
  location text,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists content_items_type_idx on public.content_items (type, published, sort_order desc, created_at desc);

alter table public.content_items enable row level security;

drop policy if exists "content: public reads published" on public.content_items;
create policy "content: public reads published" on public.content_items
  for select using (published = true);

drop policy if exists "content: staff read all" on public.content_items;
create policy "content: staff read all" on public.content_items
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid())
  );

drop policy if exists "content: staff insert" on public.content_items;
create policy "content: staff insert" on public.content_items
  for insert with check (
    exists (select 1 from public.profiles p where p.id = auth.uid())
  );

drop policy if exists "content: staff update" on public.content_items;
create policy "content: staff update" on public.content_items
  for update using (
    exists (select 1 from public.profiles p where p.id = auth.uid())
  );

drop policy if exists "content: staff delete" on public.content_items;
create policy "content: staff delete" on public.content_items
  for delete using (
    exists (select 1 from public.profiles p where p.id = auth.uid())
  );

-- Keep updated_at current on every edit.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists content_items_set_updated_at on public.content_items;
create trigger content_items_set_updated_at
  before update on public.content_items
  for each row execute function public.set_updated_at();

-- 3) Storage bucket for uploaded images/files --------------------------------
insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do nothing;

drop policy if exists "site-media: public read" on storage.objects;
create policy "site-media: public read" on storage.objects
  for select using (bucket_id = 'site-media');

drop policy if exists "site-media: staff upload" on storage.objects;
create policy "site-media: staff upload" on storage.objects
  for insert with check (
    bucket_id = 'site-media'
    and exists (select 1 from public.profiles p where p.id = auth.uid())
  );

drop policy if exists "site-media: staff delete" on storage.objects;
create policy "site-media: staff delete" on storage.objects
  for delete using (
    bucket_id = 'site-media'
    and exists (select 1 from public.profiles p where p.id = auth.uid())
  );
