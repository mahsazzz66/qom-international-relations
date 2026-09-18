import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Privileged Supabase client using the service_role key. This key bypasses
// Row Level Security entirely, so it must NEVER be exposed to the browser.
// The "server-only" import above makes any accidental client-side import of
// this file fail the build. Only use this from Route Handlers / Server
// Actions, and only after verifying the caller is an authenticated admin.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
