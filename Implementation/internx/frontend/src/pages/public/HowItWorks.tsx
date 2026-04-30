import { CheckCircle2, GraduationCap, Briefcase } from "lucide-react";
import { Panel } from "@/components/forms/Panel";
import { PublicPageHero, PublicSection } from "@/components/feedback/PublicPageHelpers";

const STUDENT_STEPS = [
  { n: 1, title: "Verify your university", body: "Sign up with your .edu / .ac email. We confirm your enrollment with our partner university network." },
  { n: 2, title: "Build your profile", body: "Add your skills, portfolio, university, and graduation year. Your profile is what businesses see." },
  { n: 3, title: "Apply (max 10 spots)", body: "Browse Basic → Hardcore projects. Each project caps applicants so your application actually gets read." },
  { n: 4, title: "Get hired & ship", body: "Use the workspace for chat, files, deliverables, and paid meetings. Submit work, get reviewed, get paid." },
  { n: 5, title: "Level up", body: "Completed projects level you up: Scholar → Associate → Professional → Expert — unlocking higher rates and harder briefs." },
];

const BUSINESS_STEPS = [
  { n: 1, title: "Verify your business", body: "Sign up as a business. We confirm your domain so students know they're talking to a real company." },
  { n: 2, title: "Post a project", body: "Define title, description, required skills, difficulty, contract type, timeline, and budget. Publish in minutes." },
  { n: 3, title: "Review applicants", body: "Up to 10 verified students apply. Compare profiles side-by-side and shortlist your favorites." },
  { n: 4, title: "Manage in-workspace", body: "Tasks, chat, paid meetings, file sharing, deliverables, and revisions — all in one place." },
  { n: 5, title: "Approve & release payment", body: "Funds sit in escrow. Approve the final deliverable and release. Leave a review to close the project." },
];

export default function HowItWorks() {
  return (
    <>
      <PublicPageHero
        eyebrow="How It Works"
        title="Two flows. One platform."
        subtitle="Whether you're a student looking for paid work or a business looking for verified talent — here's exactly how InternX works."
      />

      <PublicSection id="students">
        <div className="flex items-center gap-3 mb-8">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand/15 text-brand">
            <GraduationCap size={20} />
          </div>
          <h2 className="text-[26px] font-bold tracking-tight text-text">For Students</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {STUDENT_STEPS.map((s) => (
            <Panel key={s.n} padding="p-6">
              <div className="flex items-center gap-2 text-[12px] font-semibold text-brand">
                <span className="grid h-6 w-6 place-items-center rounded-md bg-brand/15">{s.n}</span>
                STEP {s.n}
              </div>
              <h3 className="mt-3 text-[16px] font-semibold text-text">{s.title}</h3>
              <p className="mt-2 text-[13.5px] text-text-muted leading-relaxed">{s.body}</p>
            </Panel>
          ))}
        </div>
      </PublicSection>

      <PublicSection id="businesses">
        <div className="flex items-center gap-3 mb-8">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand/15 text-brand">
            <Briefcase size={20} />
          </div>
          <h2 className="text-[26px] font-bold tracking-tight text-text">For Businesses</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {BUSINESS_STEPS.map((s) => (
            <Panel key={s.n} padding="p-6">
              <div className="flex items-center gap-2 text-[12px] font-semibold text-brand">
                <span className="grid h-6 w-6 place-items-center rounded-md bg-brand/15">{s.n}</span>
                STEP {s.n}
              </div>
              <h3 className="mt-3 text-[16px] font-semibold text-text">{s.title}</h3>
              <p className="mt-2 text-[13.5px] text-text-muted leading-relaxed">{s.body}</p>
            </Panel>
          ))}
        </div>
      </PublicSection>

      <PublicSection title="Platform rules everyone agrees to">
        <div className="grid md:grid-cols-2 gap-3">
          {[
            "Students must be verified university enrolees.",
            "Each project caps at 10 applicants — no spam.",
            "Students can hold one active project at a time.",
            "Payments are escrowed and released on approval.",
            "Reviews work both ways: businesses rate students and vice versa.",
            "Disputes are mediated by the InternX team.",
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
