"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { hasSupabaseConfig } from "@/lib/supabase-browser";
import { signInWithEmail } from "@/lib/mobile-flow-api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    if (!email.includes("@")) {
      setError("Enter a valid email.");
      return;
    }
    if (!password.trim()) {
      setError("Enter your password.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await signInWithEmail(email.trim(), password);
      router.push("/lessons");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-12">
      <h1 className="text-3xl font-bold text-white">Welcome back</h1>
      <p className="mt-2 text-sm text-white/70">Sign in to continue learning Kalenjin.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-white/80">Email address</span>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-emerald-300"
            placeholder="you@example.com"
            type="email"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-white/80">Password</span>
          <div className="flex rounded-xl border border-white/15 bg-black/20 px-3">
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full bg-transparent py-3 text-sm text-white outline-none"
              placeholder="Your password"
              type={showPassword ? "text" : "password"}
            />
            <button
              type="button"
              className="text-xs font-semibold text-emerald-200"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </label>

        {error ? <p className="rounded-lg border border-red-300/35 bg-red-400/10 px-3 py-2 text-xs text-red-200">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-emerald-300 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      {hasSupabaseConfig ? null : (
        <p className="mt-5 text-center text-xs text-amber-200">
          Supabase env vars are missing. Auth endpoints are not configured yet.
        </p>
      )}
      <p className="mt-3 text-center text-xs text-white/60">
        No account yet?{" "}
        <Link href="/signup" className="font-semibold text-emerald-200">
          Create account
        </Link>
      </p>
      <Link href="/" className="mt-2 text-center text-xs font-semibold text-emerald-200">
        Back to landing
      </Link>
    </main>
  );
}
