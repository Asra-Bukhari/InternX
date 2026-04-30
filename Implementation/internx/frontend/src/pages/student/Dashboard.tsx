import { Link } from "react-router";
import { ArrowRight, Briefcase, Award, DollarSign, CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/forms/PageShell";
import { Panel } from "@/components/forms/Panel";
import { KPIStat } from "@/components/domain/KPIStat";
import { SectionHeader } from "@/components/domain/SectionHeader";
import { ProjectCard } from "@/components/data-display/ProjectCard";
import { ProgressBar } from "@/components/data-display/ProgressBar";
import { StatusTag } from "@/components/data-display/StatusTag";
import { STUDENT, PROJECTS, APPLICATIONS, ACTIVE_PROJECT } from "@/lib/mock/student";

export default function StudentDashboard() {
  const recommended = PROJECTS.slice(0, 3);
  const recentApplications = APPLICATIONS.slice(0, 3);

  return (
    <PageShell
      title={`Welcome back, ${STUDENT.name.split(" ")[0]}`}
      subtitle={`${STUDENT.level} · ${STUDENT.university}`}
    >
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KPIStat label="Earnings" value={`₹${STUDENT.earnings.toLocaleString()}`} trend="Last 30 days" icon={<DollarSign size={16} />} accent="brand" />
        <KPIStat label="Completed" value={STUDENT.completed} trend="All-time" icon={<CheckCircle2 size={16} />} accent="success" />
        <KPIStat label="Active Apps" value={STUDENT.pending} trend="Awaiting review" icon={<Briefcase size={16} />} accent="info" />
        <KPIStat label="Rating" value={STUDENT.rating.toFixed(1)} trend="Across 4 reviews" icon={<Award size={16} />} accent="warning" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Project (left, 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Panel padding="p-6">
            <SectionHeader
              title="Your active project"
              description={ACTIVE_PROJECT.business}
              action={
                <Link to="/dashboard/student/active" className="text-[12.5px] text-brand hover:underline inline-flex items-center gap-1">
                  Open workspace <ArrowRight size={12} />
                </Link>
              }
            />
            <h3 className="text-[18px] font-semibold tracking-tight text-text">{ACTIVE_PROJECT.title}</h3>
            <p className="mt-1.5 text-[13px] text-text-muted leading-relaxed line-clamp-2">{ACTIVE_PROJECT.description}</p>
            <div className="mt-5">
              <div className="flex items-center justify-between text-[12px] text-text-subtle mb-1.5">
                <span>Progress</span>
                <span>{ACTIVE_PROJECT.progress}% · {ACTIVE_PROJECT.daysLeft} days left</span>
              </div>
              <ProgressBar value={ACTIVE_PROJECT.progress} />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-[12px] text-text-subtle">
              <div><p className="text-text-muted">Budget</p><p className="text-text font-medium mt-0.5">{ACTIVE_PROJECT.budget}</p></div>
              <div><p className="text-text-muted">Started</p><p className="text-text font-medium mt-0.5">{ACTIVE_PROJECT.startDate}</p></div>
              <div><p className="text-text-muted">Deadline</p><p className="text-text font-medium mt-0.5">{ACTIVE_PROJECT.endDate}</p></div>
            </div>
          </Panel>

          {/* Recommended */}
          <div>
            <SectionHeader
              title="Recommended for you"
              description="Based on your skills and level"
              action={
                <Link to="/dashboard/student/projects" className="text-[12.5px] text-brand hover:underline inline-flex items-center gap-1">
                  See all <ArrowRight size={12} />
                </Link>
              }
            />
            <div className="grid md:grid-cols-2 gap-4">
              {recommended.slice(0, 2).map((p) => (
                <ProjectCard key={p.id} project={p} href={`/dashboard/student/projects/${p.id}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <aside className="space-y-6">
          <Panel padding="p-5">
            <SectionHeader
              title="Recent applications"
              action={
                <Link to="/dashboard/student/applications" className="text-[12.5px] text-brand hover:underline">
                  View all
                </Link>
              }
            />
            <ul className="space-y-3">
              {recentApplications.map((a) => (
                <li key={a.id} className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-text truncate">{a.projectTitle}</p>
                    <p className="text-[11.5px] text-text-subtle">{a.business} · {a.appliedAt}</p>
                  </div>
                  <StatusTag label={a.status[0].toUpperCase() + a.status.slice(1)} variant={a.status} />
                </li>
              ))}
            </ul>
          </Panel>

          <Panel padding="p-5">
            <h3 className="text-[14px] font-semibold text-text">Level progress</h3>
            <p className="mt-1 text-[12px] text-text-subtle">2 more projects until <span className="text-brand">InternX Professional</span></p>
            <div className="mt-4">
              <ProgressBar value={70} />
            </div>
            <Link to="/dashboard/student/levels" className="mt-4 inline-flex items-center gap-1 text-[12.5px] text-brand hover:underline">
              See all levels <ArrowRight size={12} />
            </Link>
          </Panel>
        </aside>
      </div>
    </PageShell>
  );
}
