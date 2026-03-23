import LessonPractice from "@/components/learning/LessonPractice";

type Props = {
  params: Promise<{ lessonId: string }>;
};

export default async function LessonPracticePage({ params }: Readonly<Props>) {
  const { lessonId } = await params;
  return <LessonPractice lessonId={lessonId} />;
}
