import { lessonsData } from "@/content/landing";
import { Badge, BentoCard, BentoGrid, Section } from "./BentoGrid";

export function LessonSection() {
  return (
    <Section
      id="lessons"
      title="Lessons that feel like momentum"
      subtitle="Curated pathways blend guided learning, quick drills, and motivational progression."
    >
      <BentoGrid>
        {lessonsData.map((lesson, index) => (
          <BentoCard
            key={lesson.title}
            title={lesson.title}
            description={lesson.description}
            className={index === 0 || index === 3 ? "md:col-span-6" : "md:col-span-3"}
          >
            <Badge>{lesson.metric}</Badge>
          </BentoCard>
        ))}
      </BentoGrid>
    </Section>
  );
}
