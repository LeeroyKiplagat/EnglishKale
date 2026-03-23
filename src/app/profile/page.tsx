"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchWebProfile } from "@/lib/mobile-flow-api";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Awaited<ReturnType<typeof fetchWebProfile>>>(null);

  useEffect(() => {
    fetchWebProfile().then((data) => {
      setProfile(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-10">
        <p className="text-sm text-white/70">Loading profile...</p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-10">
        <p className="text-sm text-white/80">You need to login first.</p>
        <Link href="/login" className="mt-2 inline-block text-sm font-semibold text-emerald-200">
          Go to login
        </Link>
      </main>
    );
  }

  const timePracticed = profile.timePracticedMinutes >= 60
    ? `${Math.floor(profile.timePracticedMinutes / 60)}h ${profile.timePracticedMinutes % 60}m`
    : `${profile.timePracticedMinutes}m`;

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-semibold text-white">Profile</h1>

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-300/20 text-xl font-bold text-emerald-100">
            {profile.initials}
          </div>
          <div>
            <p className="text-lg font-semibold text-white">{profile.displayName}</p>
            <p className="text-sm text-white/70">{profile.email}</p>
            <p className="text-xs text-white/60">Level {profile.level}</p>
          </div>
        </div>
      </section>

      <section className="mt-4 grid gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-sm font-semibold text-emerald-200">Progress</h2>
          <ul className="mt-3 space-y-2 text-sm text-white/85">
            <li>{profile.streakDays} Days Streak</li>
            <li>{profile.lessonsCompleted} Lessons Completed</li>
            <li>{timePracticed} Time Practiced</li>
            <li>{profile.phrasesLearned} Phrases Learned</li>
          </ul>
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-sm font-semibold text-emerald-200">Achievements</h2>
          <ul className="mt-3 space-y-2 text-sm text-white/85">
            <li>{profile.streakDays > 0 ? "Daily streak active" : "Start a streak"}</li>
            <li>{profile.lessonsCompleted > 0 ? "Complete First Lesson ✓" : "Complete First Lesson"}</li>
            <li>{profile.phrasesLearned >= profile.dailyGoal ? "Daily goal reached" : "Daily goal in progress"}</li>
          </ul>
        </article>
      </section>

      <section className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-sm font-semibold text-emerald-200">Research Study</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <Link href="/research/post-test" className="rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white">
            Post-Test (14-day vocabulary): {profile.postTestDone ? "Done ✓" : "Pending"}
          </Link>
          <Link href="/research/satisfaction" className="rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white">
            Satisfaction Survey: {profile.satisfactionDone ? "Done ✓" : "Pending"}
          </Link>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-sm font-semibold text-emerald-200">Quick Settings</h2>
        <ul className="mt-3 space-y-2 text-sm text-white/85">
          <li>Daily Goal: {profile.dailyGoal} phrases</li>
          <li>App Language: English</li>
        </ul>
      </section>
    </main>
  );
}
