import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function PublicPageHero({ eyebrow, title, subtitle, className }: {
  eyebrow?: string; title: string; subtitle?: string; className?: string;
}) {
  return (
    <div className={cn("max-w-[900px] mx-auto px-6 pt-20 pb-10 text-center", className)}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full border border-border-default bg-surface-2 px-3 py-1 text-[11.5px] text-text-muted">
          {eyebrow}
        </span>
      )}
      <h1 className="mt-4 text-[40px] md:text-[52px] font-bold leading-[1.1] tracking-tight text-text">
        {title}
      </h1>
      {subtitle && <p className="mx-auto mt-5 max-w-2xl text-[16px] text-text-muted leading-relaxed">{subtitle}</p>}
    </div>
  );
}

export function PublicSection({ id, title, children }: { id?: string; title?: string; children: ReactNode }) {
  return (
    <section id={id} className="max-w-[1100px] mx-auto px-6 py-12 scroll-mt-20">
      {title && <h2 className="text-[26px] md:text-[32px] font-bold tracking-tight text-text mb-8">{title}</h2>}
      {children}
    </section>
  );
}
