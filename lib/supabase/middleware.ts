import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Refreshes the Supabase auth session on every request and guards the
// /admin section: signed-out visitors are sent to /admin/login, and signed-in
// staff visiting /admin/login are sent straight to the dashboard.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isLoginPage = path === "/admin/login";
  // The invite/reset-password link lands here before the visitor has a
  // session — the token that proves who they are only arrives in the URL
  // hash, which the browser never sends to the server, so the client-side
  // page has to load first and exchange it for a session itself. Guarding
  // this path like the rest of /admin would bounce every invite link
  // straight to the login page before that exchange can happen.
  const isSetPasswordPage = path === "/admin/set-password";
  const isAdminArea = path.startsWith("/admin") && !isLoginPage && !isSetPasswordPage;

  if (!user && isAdminArea) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  if (user && isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return response;
}
