import { Check, X } from "lucide-react";
import { Panel } from "@/components/forms/Panel";
import { PublicPageHero, PublicSection } from "@/components/feedback/PublicPageHelpers";

export default function WhyResume() {
  return (
    <>
      <PublicPageHero
        eyebrow="Why InternX"
        title="A platform built for student talent — not against it."
        subtitle="Most freelance marketplaces treat students as second-class. We built one where they're the focus."
      />

      <PublicSection id="philosophy" title="Our philosophy">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { title: "Verified > anonymous", body: "Every account is tied to a real university. No bots. No race-to-the-bottom freelancer farms." },
            { title: "Quality > volume", body: "10 applicants per project means real consideration. We'd rather have 100 great projects than 10,000 mediocre ones." },
            { title: "Outcome > activity", body: "We pay for finished work, reviewed and approved. Students build portfolios with attestation. Businesses get deliverables, not promises." },
          ].map((p) => (
            <Panel key={p.title} padding="p-6">
              <h3 className="text-[16px] font-semibold tracking-tight text-text">{p.title}</h3>
              <p className="mt-2 text-[13.5px] text-text-muted leading-relaxed">{p.body}</p>
            </Panel>
          ))}
        </div>
      </PublicSection>

      <PublicSection id="comparison" title="vs. traditional platforms">
        <div className="overflow-x-auto rounded-xl border border-border-default">
          <table className="min-w-full text-[13.5px]">
            <thead className="bg-surface-2">
              <tr className="text-left text-text-subtle">
                <th className="px-5 py-4 font-medium">Feature</th>
                <th className="px-5 py-4 font-medium">InternX</th>
                <th className="px-5 py-4 font-medium">Upwork / Fiverr</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle bg-surface-1">
              {[
                ["Verified university talent", true, false],
                ["10-applicant cap per project", true, false],
                ["Built-in escrow + approval flow", true, true],
                ["Per-minute paid meetings inside workspace", true, false],
                ["Level system tied to completed work", true, false],
                ["Race-to-the-bottom pricing", false, true],
                ["Race-to-be-first applications", false, true],
              ].map(([feat, ix, others]) => (
                <tr key={String(feat)}>
                  <td className="px-5 py-3.5 text-text">{feat as string}</td>
                  <td className="px-5 py-3.5">
                    {ix ? <Check size={15} className="text-status-success" /> : <X size={15} className="text-status-danger" />}
                  </td>
                  <td className="px-5 py-3.5">
                    {others ? <Check size={15} className="text-text-subtle" /> : <X size={15} className="text-text-subtle" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PublicSection>
    </>
  );
}
