"use client";

import Link from "next/link";
import { useState } from "react";
import { submitSatisfaction } from "@/lib/mobile-flow-api";

const likertQuestions: { key: string; text: string }[] = [
  { key: "q1", text: "I found the mobile app easy to use." },
  { key: "q2", text: "The various functions of the app were well integrated." },
  { key: "q3", text: "I felt very confident using the app to learn Kalenjin." },
  { key: "q4", text: "I think I would like to use this app frequently." },
  { key: "q5", text: "The translation of phrases provided by the app was accurate." },
  { key: "q6", text: "The gamification elements made learning enjoyable." },
  { key: "q7", text: "Spaced repetition helped me remember vocabulary." },
  { key: "q8", text: "I could quickly learn how to use the app." },
  { key: "q9", text: "The app interface was visually appealing." },
  { key: "q10", text: "Overall, I am satisfied with my learning experience." },
];

export default function SatisfactionPage() {
  const [ratings, setRatings] = useState<Record<string, number | undefined>>({});
  const [open1, setOpen1] = useState("");
  const [open2, setOpen2] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allRated = likertQuestions.every((question) => typeof ratings[question.key] === "number");

  async function onSubmit() {
    if (!allRated) {
      setError("Please rate all 10 statements before submitting.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const likertPayload: Record<string, number> = {};
      for (const question of likertQuestions) {
        likertPayload[question.key] = ratings[question.key] as number;
      }
      await submitSatisfaction({
        likert: likertPayload,
        open1,
        open2,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit survey.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-10">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          <h1 className="text-3xl font-bold text-white">Survey Submitted</h1>
          <p className="mt-3 text-white/80">Thank you for your feedback.</p>
          <div className="mt-6">
            <Link href="/profile" className="rounded-xl bg-emerald-300 px-5 py-3 text-sm font-semibold text-zinc-950">
              Back to Profile
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-semibold text-white">Satisfaction Survey</h1>
      <p className="mt-2 text-sm text-white/70">
        Rate each statement from 1 (Strongly Disagree) to 5 (Strongly Agree).
      </p>

      <section className="mt-5 space-y-3">
        {likertQuestions.map((question, index) => (
          <article key={question.key} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-white">
              <span className="font-semibold">{index + 1}.</span> {question.text}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => setRatings((prev) => ({ ...prev, [question.key]: value }))}
                  className={`h-9 w-9 rounded-lg border text-sm font-semibold ${
                    ratings[question.key] === value
                      ? "border-emerald-300 bg-emerald-300 text-zinc-950"
                      : "border-white/20 bg-white/10 text-white"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5">
        <label className="block text-sm font-semibold text-white/90">1. What did you like most about the app?</label>
        <textarea
          value={open1}
          onChange={(event) => setOpen1(event.target.value)}
          className="mt-2 min-h-24 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white"
        />
        <label className="mt-4 block text-sm font-semibold text-white/90">
          2. What challenges did you encounter or what should improve?
        </label>
        <textarea
          value={open2}
          onChange={(event) => setOpen2(event.target.value)}
          className="mt-2 min-h-24 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white"
        />
        {error ? <p className="mt-3 text-sm text-red-200">{error}</p> : null}
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="mt-4 rounded-xl bg-emerald-300 px-5 py-3 text-sm font-semibold text-zinc-950 disabled:opacity-40"
        >
          {submitting ? "Submitting..." : "Submit Survey"}
        </button>
      </section>
    </main>
  );
}
