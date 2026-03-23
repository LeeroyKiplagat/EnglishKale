// Prefer hosted APK URL, but default to the repo's public folder file.
export const apkUrl = process.env.NEXT_PUBLIC_APK_URL?.trim() || "/apk/english-kale.apk";

export const heroData = {
  eyebrow: "EnglishKale",
  title: "Learn English and Kalenjin with an AI language companion.",
  subtitle:
    "A playful learning and translation platform designed for students, families, and diaspora communities.",
  chips: ["XP progression", "Daily streaks", "Smart translation", "Android-first"],
};

export const lessonsData = [
  {
    title: "Starter Tracks",
    description: "Foundational vocabulary and pronunciation for day-one confidence.",
    metric: "12 guided modules",
  },
  {
    title: "Daily Phrases",
    description: "Useful language for greetings, travel, home, and school conversations.",
    metric: "150+ phrase cards",
  },
  {
    title: "Quiz Sprint",
    description: "Timed micro-challenges that reinforce memory and boost retention.",
    metric: "2-minute rounds",
  },
  {
    title: "Progress Pulse",
    description: "Track XP, streaks, and milestones as your fluency grows.",
    metric: "Real-time scoring",
  },
];

export const translationData = {
  title: "Translation Studio",
  description:
    "Switch between English and Kalenjin instantly with context-aware suggestions for everyday communication.",
  examples: [
    {
      from: "English",
      input: "Where is the nearest market?",
      to: "Kalenjin",
      output: "Kobo ne market ne bo kararan?",
    },
    {
      from: "Kalenjin",
      input: "Amu lakwet ak ne bo sobon?",
      to: "English",
      output: "How is your family doing?",
    },
  ],
  bullets: [
    "Two-way translation workflows",
    "Lesson-linked phrase recommendations",
    "Built for low-resource language growth",
  ],
};
