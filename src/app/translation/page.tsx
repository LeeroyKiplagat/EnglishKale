"use client";

import { useState } from "react";
import { translateToKalenjin } from "@/lib/translation-client";

export default function TranslationPage() {
  const [english, setEnglish] = useState("");
  const [kalenjin, setKalenjin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    if (!english.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await translateToKalenjin(english);
      setKalenjin(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Translation failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-bold text-white">Translation Studio</h1>
      <p className="mt-2 text-sm text-white/70">English to Kalenjin translation with model API fallback.</p>
      <p className="mt-1 text-xs text-white/55">
        Uses endpoint: <code className="rounded bg-white/10 px-1 py-0.5">NEXT_PUBLIC_MODEL_API_URL/translate</code>
      </p>

      <form onSubmit={onSubmit} className="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-white/80">English</span>
          <textarea
            value={english}
            onChange={(event) => setEnglish(event.target.value)}
            className="min-h-36 w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-emerald-300"
            placeholder="Type text in English..."
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-white/80">Kalenjin</span>
          <textarea
            value={kalenjin}
            readOnly
            className="min-h-36 w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-sm text-emerald-100 outline-none"
            placeholder="Translation appears here..."
          />
        </label>

        <div className="sm:col-span-2">
          <button className="rounded-xl bg-emerald-300 px-5 py-3 text-sm font-semibold text-zinc-950" disabled={loading}>
            {loading ? "Translating..." : "Translate now"}
          </button>
        </div>
      </form>

      {error ? <p className="mt-3 text-sm text-red-200">{error}</p> : null}
    </main>
  );
}
