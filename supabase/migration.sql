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

-- Note: no "admins can read/manage all profiles" policy exists here on
-- purpose. A policy on this table that subqueries this same table (to check
-- the caller's role) causes Postgres to report "infinite recursion detected
-- in policy for relation profiles". Admin-side staff management instead goes
-- through the server-only service-role client (lib/supabase/admin.ts), which
-- bypasses RLS entirely, so this table only needs the "self read" policy.

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
  type text not null check (type in ('news', 'statement', 'event', 'photo', 'video', 'document', 'investment')),
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
  status text not null default '',
  published boolean not null default true,
  sort_order integer not null default 0,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Re-running this file on a database created before 'investment' / `status`
-- existed: widen the type check and add the column without losing data.
alter table public.content_items add column if not exists status text not null default '';
alter table public.content_items drop constraint if exists content_items_type_check;
alter table public.content_items add constraint content_items_type_check
  check (type in ('news', 'statement', 'event', 'photo', 'video', 'document', 'investment'));

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

-- 4) Page content -------------------------------------------------------------
-- One row per static page (home, about, about-qom, pcwg, ...), holding all of
-- that page's editable text/images/lists as a single JSON document. The
-- admin's generic page editor (schema-driven) reads and writes this; each
-- public page merges it over its own hardcoded defaults, so an empty/missing
-- row never breaks the page.
create table if not exists public.page_content (
  page text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.page_content enable row level security;

drop policy if exists "page_content: public read" on public.page_content;
create policy "page_content: public read" on public.page_content
  for select using (true);

drop policy if exists "page_content: staff write" on public.page_content;
create policy "page_content: staff write" on public.page_content
  for insert with check (
    exists (select 1 from public.profiles p where p.id = auth.uid())
  );

drop policy if exists "page_content: staff update" on public.page_content;
create policy "page_content: staff update" on public.page_content
  for update using (
    exists (select 1 from public.profiles p where p.id = auth.uid())
  );

drop trigger if exists page_content_set_updated_at on public.page_content;
create trigger page_content_set_updated_at
  before update on public.page_content
  for each row execute function public.set_updated_at();
