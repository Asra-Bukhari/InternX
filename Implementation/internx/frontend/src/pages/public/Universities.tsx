import { GraduationCap, CheckCircle2 } from "lucide-react";
import { Panel } from "@/components/forms/Panel";
import { PublicPageHero, PublicSection } from "@/components/feedback/PublicPageHelpers";

const PARTNERS = [
  "MIT", "Stanford", "Harvard", "UC Berkeley", "Oxford", "Cambridge",
  "ETH Zürich", "TU Munich", "IIT Delhi", "IIT Bombay", "FAST NUCES",
  "NUS", "Tsinghua", "USP", "UCL", "Imperial College", "Toronto",
  "McGill", "Sydney", "Melbourne",
];

const ELIGIBILITY = [
  "Currently enrolled at a partner university (undergraduate or graduate)",
  "Active university email address (.edu, .ac, or recognized country-code domain)",
  "Minimum 18 years old",
  "Profile complete: skills, portfolio, university details",
  "Agreement to platform rules and code of conduct",
];

export default function Universities() {
  return (
    <>
      <PublicPageHero
        eyebrow="Universities & Eligibility"
        title="340+ partner universities. Worldwide."
        subtitle="If your university is on our list, you can join. If it's not, request to add it — we onboard new partners every week."
      />

      <PublicSection id="partners" title="Featured partner universities">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PARTNERS.map((u) => (
            <Panel key={u} padding="p-4" className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-md bg-brand/15 text-brand">
                <GraduationCap size={16} />
              </div>
              <span className="text-[13px] font-medium text-text">{u}</span>
            </Panel>
          ))}
        </div>
        <p className="mt-6 text-center text-[13px] text-text-subtle">
          + 320 more — covering all 6 inhabited continents.
        </p>
      </PublicSection>

      <PublicSection id="eligibility" title="Eligibility requirements">
        <div className="grid md:grid-cols-2 gap-3">
          {ELIGIBILITY.map((e) => (
            <div key={e} className="flex items-start gap-2 rounded-md border border-border-subtle bg-surface-2 px-4 py-3">
              <CheckCircle2 size={15} className="mt-0.5 flex-shrink-0 text-brand" />
              <span className="text-[13.5px] text-text">{e}</span>
            </div>
          ))}
        </div>
      </PublicSection>
    </>
  );
}
