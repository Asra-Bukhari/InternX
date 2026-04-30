import { Link } from "react-router";
import { ArrowRight, CheckCircle2, GraduationCap, Briefcase, Users, Zap, Shield, Star } from "lucide-react";
import { Panel } from "@/components/forms/Panel";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(var(--text) 1px, transparent 1px), linear-gradient(90deg, var(--text) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-brand-2/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-[1200px] mx-auto px-6 lg:px-12 pt-24 pb-20 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border-default bg-surface-2 px-4 py-1.5 text-[12px] text-text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
            Now hiring across 340+ universities
          </span>
          <h1 className="mt-8 text-[48px] md:text-[64px] font-bold leading-[1.05] tracking-tight text-text">
            The verified platform <br />
            for <span className="text-brand">student talent.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[16px] md:text-[18px] text-text-muted leading-relaxed">
            InternX connects vetted university students to real paid projects. Build a portfolio that matters.
            Hire talent you can trust.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/signup/student"
              className="inline-flex items-center gap-2 rounded-md bg-brand px-5 py-3 text-[14px] font-medium text-brand-foreground hover:bg-[#E55F15] transition-colors"
            >
              I'm a Student <ArrowRight size={15} />
            </Link>
            <Link
              to="/signup/business"
              className="inline-flex items-center gap-2 rounded-md border border-border-strong bg-transparent px-5 py-3 text-[14px] font-medium text-text hover:bg-surface-2 transition-colors"
            >
              I'm a Business <ArrowRight size={15} />
            </Link>
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-[12.5px] text-text-subtle">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 size={14} className="text-brand" /> 12,400+ verified students
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 size={14} className="text-brand" /> 8,200+ completed projects
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 size={14} className="text-brand" /> 340+ partner universities
            </span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-[1200px] mx-auto px-6 lg:px-12 py-20">
        <div className="text-center mb-12">
          <h2 className="text-[32px] md:text-[40px] font-bold tracking-tight text-text">How it works</h2>
          <p className="mt-3 text-[15px] text-text-muted">Two sides. One platform. Built around real work.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Panel padding="p-8">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-brand/15 text-brand">
              <GraduationCap size={22} />
            </div>
            <h3 className="mt-5 text-[20px] font-semibold tracking-tight">For Students</h3>
            <ul className="mt-5 space-y-3 text-[14px] text-text-muted">
              {[
                "Verify with your university email",
                "Browse Basic → Hardcore projects",
                "Apply (max 10 spots per project)",
                "Get hired, deliver, get paid, level up",
              ].map((s) => (
                <li key={s} className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="mt-0.5 flex-shrink-0 text-brand" />
                  {s}
                </li>
              ))}
            </ul>
            <Link
              to="/how-it-works#students"
              className="mt-6 inline-flex items-center gap-1.5 text-[13px] text-brand hover:underline"
            >
              Learn more <ArrowRight size={13} />
            </Link>
          </Panel>

          <Panel padding="p-8">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-brand/15 text-brand">
              <Briefcase size={22} />
            </div>
            <h3 className="mt-5 text-[20px] font-semibold tracking-tight">For Businesses</h3>
            <ul className="mt-5 space-y-3 text-[14px] text-text-muted">
              {[
                "Post a project with budget + skills",
                "Review verified student applicants",
                "Select, manage workspace, approve deliverables",
                "Pay only on approval — escrow protected",
              ].map((s) => (
                <li key={s} className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="mt-0.5 flex-shrink-0 text-brand" />
                  {s}
                </li>
              ))}
            </ul>
            <Link
              to="/how-it-works#businesses"
              className="mt-6 inline-flex items-center gap-1.5 text-[13px] text-brand hover:underline"
            >
              Learn more <ArrowRight size={13} />
            </Link>
          </Panel>
        </div>
      </section>

      {/* Why InternX */}
      <section className="max-w-[1200px] mx-auto px-6 lg:px-12 py-20">
        <div className="text-center mb-12">
          <h2 className="text-[32px] md:text-[40px] font-bold tracking-tight text-text">Why InternX</h2>
          <p className="mt-3 text-[15px] text-text-muted">Premium SaaS. No casual marketplace fluff.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: <Shield size={20} />, title: "Verified students only", body: "Every account is tied to a partner university email." },
            { icon: <Zap size={20} />, title: "Real work, real outcomes", body: "Live projects with deliverables and paid milestones." },
            { icon: <Users size={20} />, title: "10-applicant cap", body: "We curate quality over quantity. Your application gets read." },
            { icon: <Star size={20} />, title: "Level-based rates", body: "Scholar → Associate → Professional → Expert. Earn more as you ship." },
            { icon: <Briefcase size={20} />, title: "Escrow + approval flow", body: "Businesses pay on approved deliverables. Students get paid for finished work." },
            { icon: <GraduationCap size={20} />, title: "Resume-ready", body: "Every project becomes a portfolio entry with employer attestation." },
          ].map((c) => (
            <Panel key={c.title} padding="p-6">
              <div className="grid h-10 w-10 place-items-center rounded-md bg-brand/15 text-brand">{c.icon}</div>
              <h3 className="mt-4 text-[15px] font-semibold text-text">{c.title}</h3>
              <p className="mt-1.5 text-[13px] text-text-muted leading-relaxed">{c.body}</p>
            </Panel>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1200px] mx-auto px-6 lg:px-12 py-20">
        <div className="rounded-2xl border border-border-default bg-surface-1 p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand/10 via-transparent to-brand-2/10 pointer-events-none" />
          <h2 className="relative text-[28px] md:text-[36px] font-bold tracking-tight text-text">Ready to ship real work?</h2>
          <p className="relative mt-3 text-[15px] text-text-muted max-w-xl mx-auto">
            Join 12,400+ students and 800+ companies already using InternX.
          </p>
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-md bg-brand px-5 py-3 text-[14px] font-medium text-brand-foreground hover:bg-[#E55F15]"
            >
              Get Started <ArrowRight size={15} />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 rounded-md border border-border-strong px-5 py-3 text-[14px] font-medium text-text hover:bg-surface-2"
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
