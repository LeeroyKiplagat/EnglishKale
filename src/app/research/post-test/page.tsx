"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { fetchQuizQuestions, submitQuizAttempt, type QuizQuestion } from "@/lib/mobile-flow-api";

function optionText(question: QuizQuestion, key: string) {
  if (key === "A") return question.optionA;
  if (key === "B") return question.optionB;
  if (key === "C") return question.optionC;
  return question.optionD;
}

export default function PostTestPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string>("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const current = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const progress = useMemo(() => (questions.length ? (currentIndex + 1) / questions.length : 0), [currentIndex, questions.length]);

  useEffect(() => {
    fetchQuizQuestions()
      .then((rows) => {
        setQuestions(rows);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Could not load questions.");
        setLoading(false);
      });
  }, []);

  function onBack() {
    if (currentIndex === 0) return;
    const prev = currentIndex - 1;
    setCurrentIndex(prev);
    const prevQ = questions[prev];
    setSelected(prevQ ? (answers[prevQ.id] ?? "") : "");
  }

  async function onNext() {
    if (!current || !selected) return;
    const nextAnswers = { ...answers, [current.id]: selected };
    setAnswers(nextAnswers);
    if (!isLast) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      const nextQuestion = questions[nextIndex];
      setSelected(nextQuestion ? (nextAnswers[nextQuestion.id] ?? "") : "");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const result = await submitQuizAttempt({
        testType: "post",
        questions,
        answers: nextAnswers,
      });
      setScore(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit test.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-10">
        <p className="text-sm text-white/70">Loading post-test...</p>
      </main>
    );
  }

  if (error && !current && score === null) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-10">
        <p className="text-sm text-red-200">{error}</p>
      </main>
    );
  }

  if (score !== null) {
    const pct = questions.length ? Math.round((score / questions.length) * 100) : 0;
    return (
      <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-10">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          <h1 className="text-3xl font-bold text-white">Post-Test Complete</h1>
          <p className="mt-3 text-white/80">
            You scored {score} out of {questions.length} ({pct}%)
          </p>
          <div className="mt-6">
            <Link href="/research/satisfaction" className="rounded-xl bg-emerald-300 px-5 py-3 text-sm font-semibold text-zinc-950">
              Continue to Survey
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-semibold text-white">Post-Test - Kalenjin Vocabulary</h1>
      <div className="mt-4 h-1.5 rounded-full bg-white/15">
        <div className="h-1.5 rounded-full bg-emerald-300" style={{ width: `${progress * 100}%` }} />
      </div>

      {current ? (
        <section className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs text-white/60">
            Question {currentIndex + 1} of {questions.length}
          </p>
          <h2 className="mt-2 text-lg font-semibold text-white">{current.prompt}</h2>
          <div className="mt-4 space-y-2">
            {["A", "B", "C", "D"].map((key) => (
              <button
                key={key}
                onClick={() => setSelected(key)}
                className={`block w-full rounded-xl border px-4 py-3 text-left text-sm ${
                  selected === key ? "border-emerald-300 bg-emerald-300/10 text-emerald-100" : "border-white/15 text-white"
                }`}
              >
                <span className="mr-2 font-semibold">{key}.</span>
                {optionText(current, key)}
              </button>
            ))}
          </div>
          {error ? <p className="mt-3 text-sm text-red-200">{error}</p> : null}
          <div className="mt-5 flex gap-3">
            <button
              onClick={onBack}
              disabled={currentIndex === 0}
              className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white disabled:opacity-40"
            >
              Back
            </button>
            <button
              onClick={onNext}
              disabled={!selected || submitting}
              className="rounded-xl bg-emerald-300 px-4 py-2 text-sm font-semibold text-zinc-950 disabled:opacity-40"
            >
              {submitting ? "Submitting..." : isLast ? "Submit" : "Next"}
            </button>
          </div>
        </section>
      ) : null}
    </main>
  );
}
