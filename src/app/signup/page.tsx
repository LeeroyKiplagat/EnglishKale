"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { hasSupabaseConfig } from "@/lib/supabase-browser";
import { signUpWithEmail } from "@/lib/mobile-flow-api";

export default function SignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return setError("Enter your first and last name.");
    if (!email.includes("@")) return setError("Enter a valid email.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");

    setLoading(true);
    setError(null);
    try {
      const displayName = `${firstName.trim()} ${lastName.trim()}`.trim();
      const session = await signUpWithEmail(email.trim(), password, displayName);
      if (!session) {
        setError("Please confirm your email first, then sign in to continue.");
        return;
      }
      router.push("/consent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-up failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-12">
      <h1 className="text-3xl font-bold text-white">Create account</h1>
      <p className="mt-2 text-sm text-white/70">Join the Kalenjin learning journey.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            className="rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-emerald-300"
            placeholder="First name"
          />
          <input
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            className="rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-emerald-300"
            placeholder="Last name"
          />
        </div>

        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-emerald-300"
          placeholder="you@example.com"
          type="email"
        />

        <div className="flex rounded-xl border border-white/15 bg-black/20 px-3">
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full bg-transparent py-3 text-sm text-white outline-none"
            placeholder="At least 6 characters"
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

        {error ? <p className="rounded-lg border border-red-300/35 bg-red-400/10 px-3 py-2 text-xs text-red-200">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-emerald-300 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>

      {hasSupabaseConfig ? null : (
        <p className="mt-5 text-center text-xs text-amber-200">
          Supabase env vars are missing. Auth endpoints are not configured yet.
        </p>
      )}
      <p className="mt-3 text-center text-xs text-white/60">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-emerald-200">
          Sign in
        </Link>
      </p>
    </main>
  );
}
