"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getLesson, getPhrases } from "@/lib/lesson-data";
import { markLessonDone } from "@/lib/web-state";

type Props = {
  lessonId: string;
};

type ExerciseType = "reading" | "words" | "grammar";

function shuffle(items: string[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

export default function LessonPractice({ lessonId }: Readonly<Props>) {
  const lesson = getLesson(lessonId);
  const phrases = getPhrases(lessonId);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [selected, setSelected] = useState<string>("");
  const [built, setBuilt] = useState<string[]>([]);

  const current = phrases[index];
  const type: ExerciseType = useMemo(() => {
    const cycle: ExerciseType[] = ["reading", "words", "grammar"];
    return cycle[index % cycle.length];
  }, [index]);
  const options = useMemo(() => {
    if (!current) return [];
    const distractors = phrases.filter((p) => p.id !== current.id).map((p) => p.kalenjin).slice(0, 2);
    return shuffle([...distractors, current.kalenjin]);
  }, [current, phrases]);
  const bankWords = useMemo(() => {
    if (!current) return [];
    return shuffle(current.kalenjin.split(" ").filter((word) => !built.includes(word)));
  }, [current, built]);

  if (!lesson || !current) {
    return (
      <main className="mx-auto min-h-screen max-w-3xl px-6 py-10 text-white">
        <p>Lesson not found.</p>
        <Link href="/lessons" className="text-emerald-200">Back to lessons</Link>
      </main>
    );
  }

  function onCheck() {
    if (checked) return;
    let ok = false;
    if (type === "reading") ok = true;
    if (type === "words") ok = selected === current.kalenjin;
    if (type === "grammar") ok = built.join(" ") === current.kalenjin;

    setChecked(true);
    setCorrect(ok);
    if (ok) setScore((s) => s + 1);
    else setHearts((h) => Math.max(0, h - 1));
  }

  function onContinue() {
    if (index >= phrases.length - 1) {
      markLessonDone(lessonId);
      return;
    }
    setIndex((i) => i + 1);
    setChecked(false);
    setCorrect(null);
    setSelected("");
    setBuilt([]);
  }

  const finished = index >= phrases.length - 1 && checked;
  let primaryAction: React.ReactNode;
  if (!checked) {
    primaryAction = (
      <button onClick={onCheck} className="w-full rounded-xl bg-emerald-300 px-4 py-3 text-sm font-semibold text-zinc-950">
        Check
      </button>
    );
  } else if (finished) {
    primaryAction = (
      <Link href="/lessons" className="block w-full rounded-xl bg-emerald-300 px-4 py-3 text-center text-sm font-semibold text-zinc-950">
        Finish lesson ({score}/{phrases.length})
      </Link>
    );
  } else {
    primaryAction = (
      <button onClick={onContinue} className="w-full rounded-xl bg-emerald-300 px-4 py-3 text-sm font-semibold text-zinc-950">
        Continue
      </button>
    );
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-6 py-10">
      <div className="mb-4 flex items-center justify-between">
        <Link href="/lessons" className="rounded-lg bg-white/10 px-3 py-1 text-xs text-white">Back</Link>
        <p className="text-sm text-white/80">{lesson.title}</p>
        <p className="text-sm text-red-200">Hearts {hearts}/5</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-200">{type} - Kalenjin</p>
        <p className="mt-3 text-sm text-white/70">English</p>
        <p className="text-xl font-semibold text-white">{current.english}</p>

        {type === "reading" ? (
          <p className="mt-4 rounded-xl bg-black/20 p-3 text-lg text-white">{current.kalenjin}</p>
        ) : null}

        {type === "words" ? (
          <div className="mt-4 space-y-2">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => setSelected(option)}
                className={`block w-full rounded-xl border px-3 py-2 text-left text-sm ${
                  selected === option ? "border-emerald-300 bg-emerald-300/10 text-emerald-100" : "border-white/15 text-white"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        ) : null}

        {type === "grammar" ? (
          <div className="mt-4">
            <div className="min-h-12 rounded-xl border border-dashed border-white/20 p-3 text-white">{built.join(" ")}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {bankWords.map((word) => (
                <button
                  key={word}
                  onClick={() => setBuilt((prev) => [...prev, word])}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-white"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {checked ? (
          <p className={`mt-4 text-sm font-semibold ${correct ? "text-emerald-200" : "text-red-200"}`}>
            {correct ? "Correct! Great job." : `Not quite. Correct answer: ${current.kalenjin}`}
          </p>
        ) : null}

        <div className="mt-5">{primaryAction}</div>
      </div>
    </main>
  );
}
