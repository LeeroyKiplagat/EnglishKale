import Link from "next/link";
import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
};

type BentoGridProps = {
  children: ReactNode;
};

type BentoCardProps = {
  className?: string;
  title: string;
  description?: string;
  children?: ReactNode;
};

type BadgeProps = {
  children: ReactNode;
};

type CTAButtonProps = {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
};

export function Section({ id, title, subtitle, children }: Readonly<SectionProps>) {
  return (
    <section id={id} className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-8">
      {(title || subtitle) && (
        <header className="mb-6 space-y-2">
          {title ? <h2 className="text-3xl font-semibold tracking-tight text-white">{title}</h2> : null}
          {subtitle ? <p className="max-w-2xl text-sm text-white/70">{subtitle}</p> : null}
        </header>
      )}
      {children}
    </section>
  );
}

export function BentoGrid({ children }: Readonly<BentoGridProps>) {
  return <div className="grid grid-cols-1 gap-4 md:grid-cols-12">{children}</div>;
}

export function BentoCard({ className = "", title, description, children }: Readonly<BentoCardProps>) {
  return (
    <article
      className={`group rounded-3xl border border-white/10 bg-linear-to-br from-white/10 to-white/5 p-6 shadow-xl shadow-black/20 backdrop-blur transition-transform duration-200 hover:-translate-y-1 hover:border-emerald-300/40 ${className}`}
    >
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      {description ? <p className="mt-2 text-sm leading-6 text-white/75">{description}</p> : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </article>
  );
}

export function Badge({ children }: Readonly<BadgeProps>) {
  return (
    <span className="inline-flex items-center rounded-full border border-emerald-300/35 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-100">
      {children}
    </span>
  );
}

export function CTAButton({ href, children, variant = "primary" }: Readonly<CTAButtonProps>) {
  const classes =
    variant === "primary"
      ? "bg-emerald-400 text-zinc-950 hover:bg-emerald-300"
      : "bg-white/10 text-white ring-1 ring-inset ring-white/25 hover:bg-white/20";

  if (!href) {
    return (
      <span
        className={`inline-flex cursor-not-allowed items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold opacity-60 ${classes}`}
      >
        APK unavailable
      </span>
    );
  }

  const isApkDownload = href.startsWith("/apk/");

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-colors ${classes}`}
      {...(isApkDownload
        ? { download: true }
        : { target: "_blank", rel: "noopener noreferrer" })}
    >
      {children}
    </Link>
  );
}
