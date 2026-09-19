"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { adminFont } from "@/lib/adminFont";

// Where invite emails (and, later, "forgot password" emails) land. Supabase
// verifies the token itself and then redirects the browser here — either
// with `?code=...` (PKCE) or with the session tokens in the URL hash
// (`#access_token=...&type=invite`, older/implicit flow). Either way, no
// session exists yet on the *server* when this page first loads (the hash
// never reaches the server, and the code hasn't been exchanged yet), which
// is why the proxy/middleware explicitly lets this one path through before
// requiring a logged-in user — see lib/supabase/middleware.ts.
export default function SetPasswordPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [ready, setReady] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function init() {
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setLinkError(
            "این لینک منقضی شده یا قبلاً استفاده شده است. لطفاً از مدیر ارشد بخواه یک دعوت‌نامه جدید برایت ارسال کند."
          );
          setChecking(false);
          return;
        }
      }

      // If the link used the older hash-based format (#access_token=...),
      // the Supabase browser client picks it up on its own as soon as it's
      // created, so by the time we ask for the session here it's already set.
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setReady(true);
      } else {
        setLinkError(
          "این لینک نامعتبر یا منقضی شده است. لطفاً از مدیر ارشد بخواه یک دعوت‌نامه جدید برایت ارسال کند."
        );
      }
      setChecking(false);
    }

    init();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("رمز عبور باید حداقل ۸ کاراکتر باشد.");
      return;
    }
    if (password !== confirm) {
      setError("رمز عبور و تکرار آن یکسان نیستند.");
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className={`${adminFont.className} admin-font-scope grid min-h-screen place-items-center bg-navy px-6`} dir="rtl">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-gold/15">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#C8A75D" strokeWidth={1.5}>
              <path d="M12 2l3.6 7.3 8 1.2-5.8 5.6 1.4 8-7.2-3.8-7.2 3.8 1.4-8L.4 10.5l8-1.2z" />
            </svg>
          </div>
          <h1 className="font-serif text-2xl font-medium text-white">تنظیم رمز عبور</h1>
          <p className="mt-1 text-sm text-white/50">شهرداری قم — روابط بین‌الملل</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-7 shadow-2xl backdrop-blur">
          {checking ? (
            <p className="text-center text-sm text-white/70">در حال بررسی لینک...</p>
          ) : linkError ? (
            <div className="rounded-lg border border-red/30 bg-red/10 px-3.5 py-2.5 text-[13px] text-red">
              {linkError}
            </div>
          ) : ready ? (
            <form onSubmit={handleSubmit}>
              <label className="mb-1.5 block text-[13px] font-medium text-white/70">رمز عبور جدید</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-4 w-full rounded-lg border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-gold/60"
                placeholder="••••••••"
                dir="ltr"
              />

              <label className="mb-1.5 block text-[13px] font-medium text-white/70">تکرار رمز عبور</label>
              <input
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="mb-5 w-full rounded-lg border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-gold/60"
                placeholder="••••••••"
                dir="ltr"
              />

              {error && (
                <div className="mb-4 rounded-lg border border-red/30 bg-red/10 px-3.5 py-2.5 text-[13px] text-red">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-lg bg-gold py-2.5 text-sm font-semibold text-navy transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "در حال ذخیره..." : "ذخیره و ورود به پنل"}
              </button>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
}
