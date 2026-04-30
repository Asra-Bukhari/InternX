import { CheckCircle2 } from "lucide-react";
import { Panel } from "@/components/forms/Panel";
import { PublicPageHero, PublicSection } from "@/components/feedback/PublicPageHelpers";
import { DifficultyTag } from "@/components/data-display/DifficultyTag";

const TIERS = [
  { level: "Basic" as const, range: "Suitable for all levels", typicalBudget: "$50 – $300", duration: "1 – 2 weeks" },
  { level: "Medium" as const, range: "Associate+", typicalBudget: "$300 – $1,200", duration: "2 – 6 weeks" },
  { level: "Hard" as const, range: "Professional+", typicalBudget: "$1,200 – $4,000", duration: "4 – 10 weeks" },
  { level: "Hardcore" as const, range: "Expert only", typicalBudget: "$4,000+", duration: "8+ weeks" },
];

export default function PricingRules() {
  return (
    <>
      <PublicPageHero
        eyebrow="Pricing & Rules"
        title="No subscription. Pay for what you ship."
        subtitle="InternX takes a flat 10% platform fee on completed projects. Students keep 90%. Businesses pay only when work is approved."
      />

      <PublicSection title="Project tiers">
        <div className="grid md:grid-cols-2 gap-5">
          {TIERS.map((t) => (
            <Panel key={t.level} padding="p-6">
              <div className="flex items-center justify-between">
                <DifficultyTag level={t.level} />
                <span className="text-[12px] text-text-subtle">{t.range}</span>
              </div>
              <p className="mt-4 text-[24px] font-bold text-text">{t.typicalBudget}</p>
              <p className="text-[12.5px] text-text-subtle">Typical project budget</p>
              <p className="mt-2 text-[13px] text-text-muted">Duration: {t.duration}</p>
            </Panel>
          ))}
        </div>
      </PublicSection>

      <PublicSection title="Platform rules">
        <div className="grid md:grid-cols-2 gap-3">
          {[
            "Maximum 10 applicants per project — strictly enforced.",
            "Students hold one active project at a time.",
            "All payments held in escrow until business approves the deliverable.",
            "10% platform fee deducted on payout — no other fees.",
            "Per-minute paid meetings priced by the student inside the workspace.",
            "Refund policy: full refund if no student is selected within 14 days.",
            "Disputes are mediated within 48 hours by the InternX team.",
            "Reviews are double-blind — published once both sides submit, or after 14 days.",
          ].map((r) => (
            <div key={r} className="flex items-start gap-2 rounded-md border border-border-subtle bg-surface-2 px-4 py-3">
              <CheckCircle2 size={15} className="mt-0.5 flex-shrink-0 text-brand" />
              <span className="text-[13.5px] text-text">{r}</span>
            </div>
          ))}
        </div>
      </PublicSection>
    </>
  );
}
