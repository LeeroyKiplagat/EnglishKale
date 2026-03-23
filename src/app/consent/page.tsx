"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getCurrentUserId, hasSubmittedConsent, submitConsent } from "@/lib/mobile-flow-api";

const consentItems = [
  "I have read the information sheet and understand the study.",
  "I have had the opportunity to ask questions and they were answered.",
  "I understand that my participation is voluntary.",
  "I agree to use the app and participate in pre/post tests.",
  "I agree anonymized data can be used for research publications.",
];

export default function ConsentPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [checks, setChecks] = useState<boolean[]>([false, false, false, false, false]);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [alreadyConsented, setAlreadyConsented] = useState(false);

  const allChecked = useMemo(() => checks.every(Boolean), [checks]);
  const canSubmit = allChecked && name.trim().length > 1;
  const toggleCheck = (index: number, value: boolean) => {
    setChecks((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  useEffect(() => {
    void (async () => {
      try {
        const userId = await getCurrentUserId();
        if (!userId) {
          router.push("/login");
          return;
        }
        const alreadyConsented = await hasSubmittedConsent(userId);
        if (alreadyConsented) {
          setAlreadyConsented(true);
          return;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load consent status.");
      } finally {
        setChecking(false);
      }
    })();
  }, [router]);

  function submit() {
    if (checking) return;
    if (alreadyConsented) return;
    if (!canSubmit) {
      setError("Please complete all checkboxes and enter your full name.");
      return;
    }
    void (async () => {
      const userId = await getCurrentUserId();
      if (!userId) {
        router.push("/login");
        return;
      }
      try {
        await submitConsent({
          participantName: name.trim(),
          c1: checks[0],
          c2: checks[1],
          c3: checks[2],
          c4: checks[3],
          c5: checks[4],
        });
        router.push("/lessons");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not save your consent.");
      }
    })();
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-6 py-10">
      {checking ? <p className="mb-4 text-sm text-white/70">Checking consent status...</p> : null}
      <h1 className="text-3xl font-bold text-white">Research Consent</h1>
      <p className="mt-2 text-sm text-white/70">
        Ethics Ref 101195 - Strathmore University.
      </p>

      {alreadyConsented ? (
        <section className="mt-6 rounded-2xl border border-emerald-300/35 bg-emerald-400/10 p-6">
          <p className="inline-flex rounded-full border border-emerald-300/45 bg-emerald-300/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-100">
            Consent Complete
          </p>
          <h2 className="mt-4 text-xl font-semibold text-white">You already submitted consent</h2>
          <p className="mt-2 text-sm leading-6 text-white/80">
            Your consent is already recorded for this account, so you do not need to submit this form again.
            You can continue to lessons and proceed with your study activities.
          </p>
          <button
            onClick={() => router.push("/lessons")}
            className="mt-5 rounded-xl bg-emerald-300 px-4 py-3 text-sm font-semibold text-zinc-950"
          >
            Continue to Lessons
          </button>
        </section>
      ) : null}

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-sm font-semibold text-emerald-200">PART I - Participant Information</h2>
        <p className="mt-3 text-sm leading-6 text-white/80">
          You are invited to take part in a language-learning research study using the EnglishKale app.
          Participation is voluntary and focuses on AI-supported English-Kalenjin learning outcomes.
        </p>
      </section>

      <section className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-sm font-semibold text-emerald-200">PART II - Consent Form</h2>
        <div className="mt-4 space-y-3">
          {consentItems.map((item, index) => (
            <label key={item} className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white/90">
              <input
                type="checkbox"
                checked={checks[index]}
                onChange={(event) => toggleCheck(index, event.target.checked)}
                className="mt-0.5 h-4 w-4 accent-emerald-400"
              />
              <span>{item}</span>
            </label>
          ))}
        </div>

        <div className="mt-4">
          <label htmlFor="participantName" className="mb-1 block text-xs font-semibold text-white/80">
            Participant full name
          </label>
          <input
            id="participantName"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter your full name"
            className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-emerald-300"
          />
        </div>

        {error ? <p className="mt-3 text-xs text-red-200">{error}</p> : null}

        <button
          onClick={submit}
          className="mt-5 w-full rounded-xl bg-emerald-300 px-4 py-3 text-sm font-semibold text-zinc-950 disabled:opacity-60"
          disabled={!canSubmit || checking || alreadyConsented}
        >
          I CONSENT - CONTINUE
        </button>
      </section>
    </main>
  );
}
