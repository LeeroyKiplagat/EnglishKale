export type Phrase = {
  id: string;
  english: string;
  kalenjin: string;
};

export type Lesson = {
  id: string;
  courseId: string;
  title: string;
  sortOrder: number;
};

export type Course = {
  id: string;
  title: string;
  levelLabel: string;
};

export const courses: Course[] = [
  { id: "demo-1", title: "Beginner Essentials", levelLabel: "Beginner" },
  { id: "demo-2", title: "Numbers and Counting", levelLabel: "Starter Plus" },
  { id: "demo-3", title: "Family and Home", levelLabel: "Conversational" },
];

export const lessonsByCourse: Record<string, Lesson[]> = {
  "demo-1": [
    { id: "demo-lesson-1a", courseId: "demo-1", title: "Basic Greetings", sortOrder: 1 },
    { id: "demo-lesson-1b", courseId: "demo-1", title: "Polite Expressions", sortOrder: 2 },
    { id: "demo-lesson-1c", courseId: "demo-1", title: "Introductions", sortOrder: 3 },
  ],
  "demo-2": [
    { id: "demo-lesson-2a", courseId: "demo-2", title: "Numbers 1-5", sortOrder: 1 },
    { id: "demo-lesson-2b", courseId: "demo-2", title: "Numbers 6-10", sortOrder: 2 },
  ],
  "demo-3": [
    { id: "demo-lesson-3a", courseId: "demo-3", title: "Family", sortOrder: 1 },
    { id: "demo-lesson-3b", courseId: "demo-3", title: "Around the Home", sortOrder: 2 },
    { id: "demo-lesson-3c", courseId: "demo-3", title: "Asking Questions", sortOrder: 3 },
  ],
};

export const phrasesByLesson: Record<string, Phrase[]> = {
  "demo-lesson-1a": [
    { id: "p1", english: "Good morning", kalenjin: "Kiptai mising" },
    { id: "p2", english: "Good evening", kalenjin: "Kiptai soiyet" },
    { id: "p3", english: "Hello", kalenjin: "Chamgei" },
    { id: "p4", english: "How are you?", kalenjin: "Ago tugul?" },
  ],
  "demo-lesson-1b": [
    { id: "p7", english: "Thank you", kalenjin: "Kongoi" },
    { id: "p8", english: "Please", kalenjin: "Ibwat" },
    { id: "p9", english: "Sorry", kalenjin: "Ndiyo" },
    { id: "p10", english: "Welcome", kalenjin: "Matya" },
  ],
  "demo-lesson-1c": [
    { id: "p12", english: "What is your name?", kalenjin: "Ango kimetai?" },
    { id: "p13", english: "My name is...", kalenjin: "Imetai..." },
    { id: "p14", english: "Where are you from?", kalenjin: "Ago abai?" },
    { id: "p15", english: "I am from Kenya", kalenjin: "Ngabar Kenya" },
  ],
  "demo-lesson-2a": [
    { id: "p17", english: "One", kalenjin: "Abel" },
    { id: "p18", english: "Two", kalenjin: "Aeng" },
    { id: "p19", english: "Three", kalenjin: "Somok" },
    { id: "p20", english: "Four", kalenjin: "Ang'wan" },
  ],
  "demo-lesson-2b": [
    { id: "p22", english: "Six", kalenjin: "Mwak" },
    { id: "p23", english: "Seven", kalenjin: "Tisab" },
    { id: "p24", english: "Eight", kalenjin: "Seet" },
    { id: "p25", english: "Nine", kalenjin: "Sogol" },
  ],
  "demo-lesson-3a": [
    { id: "p27", english: "Mother", kalenjin: "Yei" },
    { id: "p28", english: "Father", kalenjin: "Baba" },
    { id: "p29", english: "Child", kalenjin: "Lakwet" },
    { id: "p30", english: "Brother", kalenjin: "Ngetuny" },
  ],
  "demo-lesson-3b": [
    { id: "p32", english: "Water", kalenjin: "Metit" },
    { id: "p33", english: "Food", kalenjin: "Ngurum" },
    { id: "p34", english: "House", kalenjin: "Mwai" },
    { id: "p35", english: "Fire", kalenjin: "Kerisiet" },
  ],
  "demo-lesson-3c": [
    { id: "p37", english: "Where is it?", kalenjin: "Ago abai?" },
    { id: "p38", english: "What is this?", kalenjin: "Ango ne?" },
    { id: "p39", english: "How much?", kalenjin: "Ango bik?" },
    { id: "p40", english: "Come here", kalenjin: "Bo kae" },
  ],
};

export function getLessons(courseId: string): Lesson[] {
  return lessonsByCourse[courseId] ?? [];
}

export function getLesson(lessonId: string): Lesson | undefined {
  return Object.values(lessonsByCourse)
    .flat()
    .find((lesson) => lesson.id === lessonId);
}

export function getPhrases(lessonId: string): Phrase[] {
  return phrasesByLesson[lessonId] ?? [];
}
