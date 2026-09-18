import { createClient } from "@supabase/supabase-js";

// A plain, unauthenticated Supabase client for public reads (no cookies, no
// session). Row Level Security only exposes rows with published = true to
// this client, so it's safe to use in Server Components for public pages.
export function createPublicClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
  });
}
