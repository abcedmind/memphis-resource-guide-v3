"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/** Shows the error the auth callback redirects here with (expired link etc.). */
function CallbackError() {
  const params = useSearchParams();
  const msg = params.get("error");
  if (!msg) return null;
  return (
    <div
      className="text-[11px] text-signal bg-signal-tint border border-signal rounded-md px-3 py-2 mb-3 leading-relaxed"
      role="alert"
    >
      {msg}
    </div>
  );
}

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  const sendLink = async () => {
    if (!email.trim()) return;
    setState("sending");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          // Never create an account from this form. Supabase's default is to
          // sign up any new email, and the RLS policies treat every signed-in
          // user as an admin, so without this anyone could read registrations.
          shouldCreateUser: false,
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin/resources`,
        },
      });
      if (error) throw error;
      setState("sent");
    } catch (e) {
      setErrMsg(e instanceof Error ? e.message : "Something went wrong.");
      setState("error");
    }
  };

  if (state === "sent")
    return (
      <div className="px-6 py-10 text-center">
        <h2 className="text-lg text-ink m-0 mb-2">Check your email</h2>
        <p className="text-[13px] text-muted leading-relaxed max-w-[360px] mx-auto">
          We sent a magic sign-in link to <b>{email}</b>. Open it on this
          device to enter the admin panel.
        </p>
      </div>
    );

  return (
    <div className="px-4 pt-[18px] pb-10 max-w-[400px] mx-auto">
      <h2 className="text-lg font-extrabold text-ink mb-1">Admin sign-in</h2>
      <p className="text-xs text-muted mb-4 leading-relaxed">
        Admin access uses email magic links — no passwords. Only accounts
        created in the Supabase Auth dashboard can manage the guide.
      </p>
      <Suspense fallback={null}>
        <CallbackError />
      </Suspense>
      <label
        className="text-[10px] tracking-[0.05em] text-muted block mb-[3px] font-semibold"
        htmlFor="login-email"
      >
        ADMIN EMAIL
      </label>
      <input
        id="login-email"
        type="email"
        autoComplete="email"
        className="w-full box-border border border-line-strong rounded-md px-2.5 py-[9px] text-[13px] mb-2.5 bg-paper text-ink"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendLink()}
        placeholder="you@example.org"
      />
      {state === "error" && (
        <div className="text-[11px] text-signal mb-2" role="alert">
          {errMsg}
        </div>
      )}
      <button
        onClick={sendLink}
        disabled={state === "sending"}
        className="w-full bg-ink text-white rounded-lg py-[13px] text-sm font-bold disabled:opacity-60"
      >
        {state === "sending" ? "Sending…" : "Email me a sign-in link →"}
      </button>
    </div>
  );
}
