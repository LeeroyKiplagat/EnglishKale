import { translationData } from "@/content/landing";
import { BentoCard, BentoGrid, Section } from "./BentoGrid";

export function TranslationSection() {
  return (
    <Section
      id="translation"
      title="Translation that teaches while it helps"
      subtitle={translationData.description}
    >
      <BentoGrid>
        <BentoCard
          className="md:col-span-7"
          title={`${translationData.examples[0].from} to ${translationData.examples[0].to}`}
          description={translationData.examples[0].input}
        >
          <p className="rounded-2xl border border-white/15 bg-black/25 p-3 text-sm text-emerald-200">
            {translationData.examples[0].output}
          </p>
        </BentoCard>

        <BentoCard
          className="md:col-span-5"
          title={`${translationData.examples[1].from} to ${translationData.examples[1].to}`}
          description={translationData.examples[1].input}
        >
          <p className="rounded-2xl border border-white/15 bg-black/25 p-3 text-sm text-emerald-200">
            {translationData.examples[1].output}
          </p>
        </BentoCard>

        <BentoCard className="md:col-span-12" title="What makes it different">
          <ul className="grid gap-2 text-sm text-white/80 sm:grid-cols-3">
            {translationData.bullets.map((bullet) => (
              <li key={bullet} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                {bullet}
              </li>
            ))}
          </ul>
        </BentoCard>
      </BentoGrid>
    </Section>
  );
}
