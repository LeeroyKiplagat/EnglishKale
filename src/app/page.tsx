import { apkUrl, heroData } from "@/content/landing";
import { LessonSection } from "@/components/landing/LessonSection";
import { TranslationSection } from "@/components/landing/TranslationSection";
import { Badge, BentoCard, BentoGrid, CTAButton, Section } from "@/components/landing/BentoGrid";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#04120d]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(16,185,129,.25),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,.2),transparent_35%)]" />

      <main className="relative z-10 py-8 sm:py-14">
        <Section>
          <BentoGrid>
            <BentoCard className="md:col-span-8 md:row-span-2" title={heroData.title} description={heroData.subtitle}>
              <div className="mt-5 flex flex-wrap gap-2">
                {heroData.chips.map((chip) => (
                  <Badge key={chip}>{chip}</Badge>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <CTAButton href={apkUrl || undefined}>Download APK</CTAButton>
                <CTAButton href="#lessons" variant="secondary">
                  Explore lessons
                </CTAButton>
                <Link
                  href="/lessons"
                  className="inline-flex items-center justify-center rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-inset ring-white/25 transition hover:bg-white/20"
                >
                  Launch web app
                </Link>
              </div>
            </BentoCard>

            <BentoCard
              className="md:col-span-4"
              title="Mission"
              description="AI-powered English and Kalenjin learning for communities preserving language through technology."
            >
              <p className="text-sm text-white/75">{heroData.eyebrow}</p>
            </BentoCard>

            <BentoCard
              className="md:col-span-4"
              title="Android-first release"
              description="Install directly and start learning in minutes."
            >
              <CTAButton href={apkUrl || undefined} variant="secondary">
                {apkUrl ? "Get Android build" : "APK unavailable"}
              </CTAButton>
            </BentoCard>

            <BentoCard
              className="md:col-span-4"
              title="Practice on web"
              description="Try login, consent, lessons, and translation in your browser."
            >
              <div className="flex flex-wrap gap-2">
                <Link href="/lessons" className="rounded-lg bg-emerald-300 px-3 py-2 text-xs font-semibold text-zinc-950">
                  Lessons
                </Link>
                <Link href="/translation" className="rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white">
                  Translation
                </Link>
              </div>
            </BentoCard>
          </BentoGrid>
        </Section>

        <LessonSection />
        <TranslationSection />

        <Section title="Built for language impact" subtitle="Research-informed design with practical outcomes for learners.">
          <BentoGrid>
            <BentoCard
              className="md:col-span-4"
              title="Measured progress"
              description="Assess vocabulary growth with guided checkpoints and completion milestones."
            />
            <BentoCard
              className="md:col-span-4"
              title="Community-centered"
              description="Supports learners at home, in school, and in diaspora contexts."
            />
            <BentoCard
              className="md:col-span-4"
              title="Future-ready"
              description="Composable architecture for upcoming app-store links and expanded language content."
            />
          </BentoGrid>
        </Section>
      </main>

      <footer className="relative z-10 border-t border-white/10 px-6 py-6 text-center text-xs text-white/60 sm:px-8">
        EnglishKale - Learn, translate, and preserve language with confidence.
      </footer>
    </div>
  );
}
