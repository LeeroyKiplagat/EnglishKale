"use client";

import { getLessons, type Lesson } from "@/lib/lesson-data";
import { supabase } from "@/lib/supabase-browser";

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function signInWithEmail(email: string, password: string) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
}

export async function signUpWithEmail(email: string, password: string, displayName: string) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } },
  });
  if (error) throw new Error(error.message);
  return data.session ?? null;
}

export async function getCurrentUserId() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function submitConsent(payload: {
  participantName: string;
  c1: boolean;
  c2: boolean;
  c3: boolean;
  c4: boolean;
  c5: boolean;
}) {
  if (!supabase) throw new Error("Supabase is not configured.");

  // RLS insert policy requires a valid auth JWT so auth.uid() resolves.
  try {
    await supabase.auth.refreshSession();
  } catch {
    // Fall back to session checks below when refresh is unavailable.
  }

  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session?.access_token) {
    throw new Error("Your session is not active. Please sign in again.");
  }

  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Not authenticated.");

  // Consent is one record per user. If it already exists, treat as success.
  const { data: existing, error: existingError } = await supabase
    .from("consent_records")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();
  if (existingError) throw new Error(existingError.message);
  if (existing?.id) return;

  const { error } = await supabase.from("consent_records").insert({
    user_id: userId,
    participant_name: payload.participantName,
    consent_read_info: payload.c1,
    consent_questions_answered: payload.c2,
    consent_voluntary: payload.c3,
    consent_use_app: payload.c4,
    consent_anonymized_data: payload.c5,
  });
  if (error) throw new Error(error.message);
}

export async function hasSubmittedConsent(userId: string): Promise<boolean> {
  if (!supabase) return false;
  const { data, error } = await supabase
    .from("consent_records")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return Boolean(data?.id);
}

export async function fetchLessonsForCourse(courseId: string): Promise<Lesson[]> {
  if (!supabase) return getLessons(courseId);
  if (!isUuid(courseId)) return getLessons(courseId);

  const { data, error } = await supabase.from("lessons").select("*").eq("course_id", courseId).order("sort_order");
  if (error || !data) return getLessons(courseId);

  return data.map((row) => ({
    id: row.id as string,
    courseId: row.course_id as string,
    title: row.title as string,
    sortOrder: Number(row.sort_order ?? 0),
  }));
}

export type WebProfile = {
  id: string;
  displayName: string;
  email: string;
  level: number;
  streakDays: number;
  dailyGoal: number;
  phrasesLearned: number;
  lessonsCompleted: number;
  timePracticedMinutes: number;
  postTestDone: boolean;
  satisfactionDone: boolean;
  initials: string;
};

function initialsFromName(name: string) {
  const parts = name.split(" ").filter(Boolean).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "EK";
}

export async function fetchWebProfile(): Promise<WebProfile | null> {
  if (!supabase) return null;
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;
  if (!user) return null;

  const displayName = (user.user_metadata?.display_name as string | undefined) ?? user.email?.split("@")[0] ?? "Learner";

  const profileBase: WebProfile = {
    id: user.id,
    displayName,
    email: user.email ?? "",
    level: 1,
    streakDays: 0,
    dailyGoal: 5,
    phrasesLearned: 0,
    lessonsCompleted: 0,
    timePracticedMinutes: 0,
    postTestDone: false,
    satisfactionDone: false,
    initials: initialsFromName(displayName),
  };

  try {
    const [
      profileRes,
      learnedRes,
      lessonEventsRes,
      postQuizRes,
      satisfactionRes,
    ] = await Promise.all([
      supabase.from("profiles").select("display_name, level, streak_days, daily_goal").eq("id", user.id).maybeSingle(),
      supabase.from("user_phrase_progress").select("phrase_id").eq("user_id", user.id).eq("learned", true),
      supabase.from("lesson_events").select("id").eq("user_id", user.id).not("completed_at", "is", null),
      supabase.from("quiz_attempts").select("id, completed_at").eq("user_id", user.id).eq("test_type", "post").maybeSingle(),
      supabase.from("satisfaction_responses").select("id").eq("user_id", user.id).maybeSingle(),
    ]);

    const profileRow = profileRes.data;
    const learnedCount = learnedRes.data?.length ?? 0;
    const lessonsCompleted = lessonEventsRes.data?.length ?? 0;

    const name = (profileRow?.display_name as string | null) || displayName;
    const level = Number(profileRow?.level ?? 1);
    const streakDays = Number(profileRow?.streak_days ?? 0);
    const dailyGoal = Number(profileRow?.daily_goal ?? 5);

    return {
      ...profileBase,
      displayName: name,
      level,
      streakDays,
      dailyGoal,
      phrasesLearned: learnedCount,
      lessonsCompleted,
      timePracticedMinutes: learnedCount * 2,
      postTestDone: Boolean(postQuizRes.data?.completed_at),
      satisfactionDone: Boolean(satisfactionRes.data?.id),
      initials: initialsFromName(name),
    };
  } catch {
    return profileBase;
  }
}

export type QuizQuestion = {
  id: string;
  sortOrder: number;
  prompt: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correct: "A" | "B" | "C" | "D";
};

export async function fetchQuizQuestions(): Promise<QuizQuestion[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from("quiz_questions").select("*").order("sort_order");
  if (error || !data) throw new Error(error?.message ?? "Could not load quiz questions.");
  return data.map((row) => ({
    id: row.id as string,
    sortOrder: Number(row.sort_order ?? 0),
    prompt: row.prompt as string,
    optionA: row.option_a as string,
    optionB: row.option_b as string,
    optionC: row.option_c as string,
    optionD: row.option_d as string,
    correct: (row.correct as "A" | "B" | "C" | "D") ?? "A",
  }));
}

export async function hasCompletedTest(testType: "pre" | "post"): Promise<boolean> {
  if (!supabase) return false;
  const userId = await getCurrentUserId();
  if (!userId) return false;
  const { data, error } = await supabase
    .from("quiz_attempts")
    .select("completed_at")
    .eq("user_id", userId)
    .eq("test_type", testType)
    .maybeSingle();
  if (error || !data) return false;
  return Boolean(data.completed_at);
}

export async function submitQuizAttempt(params: {
  testType: "pre" | "post";
  questions: QuizQuestion[];
  answers: Record<string, string>;
}) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Not signed in.");

  const now = new Date().toISOString();
  const { error: upsertError } = await supabase.from("quiz_attempts").upsert(
    {
      user_id: userId,
      test_type: params.testType,
      started_at: now,
    },
    { onConflict: "user_id,test_type" },
  );
  if (upsertError) throw new Error(upsertError.message);

  const { data: attemptRow, error: attemptError } = await supabase
    .from("quiz_attempts")
    .select("id")
    .eq("user_id", userId)
    .eq("test_type", params.testType)
    .single();
  if (attemptError || !attemptRow) throw new Error(attemptError?.message ?? "Could not create attempt.");

  const attemptId = attemptRow.id as string;
  let score = 0;
  const rows = params.questions.map((question) => {
    const selected = params.answers[question.id];
    const isCorrect = selected === question.correct;
    if (isCorrect) score += 1;
    return {
      attempt_id: attemptId,
      user_id: userId,
      question_id: question.id,
      selected,
      is_correct: isCorrect,
      answered_at: now,
    };
  });

  await supabase.from("quiz_responses").delete().eq("attempt_id", attemptId);
  const { error: responseError } = await supabase.from("quiz_responses").insert(rows);
  if (responseError) throw new Error(responseError.message);

  const { error: completeError } = await supabase
    .from("quiz_attempts")
    .update({ completed_at: now, score })
    .eq("id", attemptId);
  if (completeError) throw new Error(completeError.message);

  return score;
}

export async function hasSatisfactionResponse(): Promise<boolean> {
  if (!supabase) return false;
  const userId = await getCurrentUserId();
  if (!userId) return false;
  const { data } = await supabase.from("satisfaction_responses").select("id").eq("user_id", userId).maybeSingle();
  return Boolean(data);
}

export async function submitSatisfaction(params: {
  likert: Record<string, number>;
  open1: string;
  open2: string;
}) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Not signed in.");
  const { error } = await supabase.from("satisfaction_responses").upsert(
    {
      user_id: userId,
      submitted_at: new Date().toISOString(),
      ...params.likert,
      open1: params.open1.trim(),
      open2: params.open2.trim(),
    },
    { onConflict: "user_id" },
  );
  if (error) throw new Error(error.message);
}
