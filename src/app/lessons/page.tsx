"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { courses, type Lesson } from "@/lib/lesson-data";
import { fetchLessonsForCourse, fetchWebProfile, getCurrentUserId } from "@/lib/mobile-flow-api";
import { getLessonProgress } from "@/lib/web-state";

export default function LessonsPage() {
  const [courseId, setCourseId] = useState(courses[0].id);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [postTestDone, setPostTestDone] = useState(false);
  const [satisfactionDone, setSatisfactionDone] = useState(false);
  const doneSet = new Set(getLessonProgress());
  const noData = useMemo(() => !loading && lessons.length === 0, [loading, lessons.length]);

  useEffect(() => {
    void (async () => {
      const userId = await getCurrentUserId();
      setAuthenticated(Boolean(userId));
      if (!userId) {
        setLessons([]);
        setLoading(false);
        return;
      }

      const profile = await fetchWebProfile();
      setPostTestDone(Boolean(profile?.postTestDone));
      setSatisfactionDone(Boolean(profile?.satisfactionDone));

      setLoading(true);
      const rows = await fetchLessonsForCourse(courseId);
      setLessons(rows);
      setLoading(false);
    })();
  }, [courseId]);

  if (authenticated === false) {
    return (
      <main className="mx-auto min-h-screen max-w-3xl px-6 py-10 text-white">
        <p>Please sign in first.</p>
        <Link href="/login" className="text-emerald-200">
          Go to login
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold text-white">Lessons</h1>
      <p className="mt-2 text-sm text-white/70">Complete each lesson to unlock the next one.</p>

      <section className="mt-6 rounded-2xl border border-emerald-300/30 bg-emerald-400/10 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-200">Research Activities</p>
            <h2 className="mt-1 text-lg font-semibold text-white">Quiz and Satisfaction Survey</h2>
            <p className="mt-1 text-sm text-white/75">Complete both study activities to finish your research participation.</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <article className="rounded-xl border border-white/15 bg-black/20 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-white">Post-Test Quiz</p>
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                  postTestDone ? "bg-emerald-300 text-zinc-900" : "bg-amber-300 text-zinc-900"
                }`}
              >
                {postTestDone ? "Done" : "Pending"}
              </span>
            </div>
            <p className="mt-2 text-xs text-white/70">Measure your learning outcomes after lessons.</p>
            <Link href="/research/post-test" className="mt-3 inline-block rounded-lg bg-emerald-300 px-3 py-2 text-xs font-semibold text-zinc-950">
              {postTestDone ? "Retake Post-Test" : "Start Post-Test"}
            </Link>
          </article>

          <article className="rounded-xl border border-white/15 bg-black/20 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-white">Satisfaction Survey</p>
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                  satisfactionDone ? "bg-emerald-300 text-zinc-900" : "bg-amber-300 text-zinc-900"
                }`}
              >
                {satisfactionDone ? "Done" : "Pending"}
              </span>
            </div>
            <p className="mt-2 text-xs text-white/70">Share your experience using the app and lessons.</p>
            <Link href="/research/satisfaction" className="mt-3 inline-block rounded-lg bg-emerald-300 px-3 py-2 text-xs font-semibold text-zinc-950">
              {satisfactionDone ? "Update Survey" : "Start Survey"}
            </Link>
          </article>
        </div>
      </section>

      <div className="mt-5 flex flex-wrap gap-2">
        {courses.map((course) => (
          <button
            key={course.id}
            onClick={() => setCourseId(course.id)}
            className={`rounded-full px-4 py-2 text-xs font-semibold ${
              courseId === course.id ? "bg-emerald-300 text-zinc-950" : "bg-white/10 text-white"
            }`}
          >
            {course.title}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {loading ? <p className="text-sm text-white/70">Loading lessons...</p> : null}
        {noData ? <p className="text-sm text-white/70">No lessons found for this course yet.</p> : null}
        {lessons.map((lesson, index) => {
          const previous = lessons[index - 1];
          const isLocked = index > 0 && previous && !doneSet.has(previous.id);
          const isDone = doneSet.has(lesson.id);
          let subtitle = "Tap to start.";
          if (isDone) subtitle = "Completed - tap to practice again.";
          if (isLocked) subtitle = "Locked - finish previous lesson first.";

          return (
            <article key={lesson.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-white/60">Lesson {index + 1}</p>
              <h2 className="mt-1 text-lg font-semibold text-white">{lesson.title}</h2>
              <p className="mt-2 text-sm text-white/75">{subtitle}</p>
              <Link
                href={isLocked ? "#" : `/lessons/${lesson.id}`}
                className={`mt-4 inline-block rounded-xl px-3 py-2 text-xs font-semibold ${
                  isLocked ? "cursor-not-allowed bg-white/10 text-white/40" : "bg-emerald-300 text-zinc-950"
                }`}
                aria-disabled={isLocked}
              >
                {isLocked ? "Locked" : "Start lesson"}
              </Link>
            </article>
          );
        })}
      </div>
    </main>
  );
}
