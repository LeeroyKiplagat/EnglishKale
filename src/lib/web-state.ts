const STORAGE_KEYS = {
  authEmail: "englishkale_auth_email",
  consentName: "englishkale_consent_name",
  consentAccepted: "englishkale_consent_accepted",
  lessonProgress: "englishkale_lessons_done",
} as const;

function inBrowser() {
  return globalThis.window !== undefined;
}

export function getAuthEmail(): string | null {
  if (!inBrowser()) return null;
  return localStorage.getItem(STORAGE_KEYS.authEmail);
}

export function setAuthEmail(email: string) {
  if (!inBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.authEmail, email);
}

export function isConsentAccepted(): boolean {
  if (!inBrowser()) return false;
  return localStorage.getItem(STORAGE_KEYS.consentAccepted) === "true";
}

export function setConsent(name: string) {
  if (!inBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.consentName, name);
  localStorage.setItem(STORAGE_KEYS.consentAccepted, "true");
}

export function getLessonProgress(): string[] {
  if (!inBrowser()) return [];
  const raw = localStorage.getItem(STORAGE_KEYS.lessonProgress);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function markLessonDone(lessonId: string) {
  if (!inBrowser()) return;
  const current = new Set(getLessonProgress());
  current.add(lessonId);
  localStorage.setItem(STORAGE_KEYS.lessonProgress, JSON.stringify([...current]));
}
