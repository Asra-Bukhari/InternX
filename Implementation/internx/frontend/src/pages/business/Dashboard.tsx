import { Link } from "react-router";
import { ArrowRight, FolderOpen, Users, CheckCircle2, DollarSign, Package } from "lucide-react";
import { PageShell } from "@/components/forms/PageShell";
import { Panel } from "@/components/forms/Panel";
import { KPIStat } from "@/components/domain/KPIStat";
import { SectionHeader } from "@/components/domain/SectionHeader";
import { ProgressBar } from "@/components/data-display/ProgressBar";
import { StatusTag, type StatusVariant } from "@/components/data-display/StatusTag";
import { DifficultyTag } from "@/components/data-display/DifficultyTag";
import { PrimaryButton } from "@/components/forms/PrimaryButton";
import { BUSINESS, BUSINESS_PROJECTS, BUSINESS_APPLICANTS } from "@/lib/mock/business";
import type { Difficulty } from "@/types/project";

function statusVariant(s: string): StatusVariant {
  const lc = s.toLowerCase();
  if (lc.includes("progress")) return "in-progress";
  if (lc.includes("hiring")) return "info";
  if (lc.includes("complete")) return "completed";
  return "draft";
}

export default function BusinessDashboard() {
  return (
    <PageShell
      title={`Welcome, ${BUSINESS.name.split(" ")[0]}`}
      subtitle={BUSINESS.company}
      actions={
        <Link to="/dashboard/business/projects/new">
          <PrimaryButton size="md">+ New Project</PrimaryButton>
        </Link>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <KPIStat label="Active" value={BUSINESS.activeProjects} icon={<FolderOpen size={16} />} accent="brand" />
        <KPIStat label="Hiring" value="2" trend="5 applicants" icon={<Users size={16} />} accent="info" />
        <KPIStat label="Completed" value={BUSINESS.completedProjects} icon={<CheckCircle2 size={16} />} accent="success" />
        <KPIStat label="Total Spent" value={`$${BUSINESS.totalSpent.toLocaleString()}`} icon={<DollarSign size={16} />} accent="warning" />
        <KPIStat label="Pending" value={BUSINESS.pendingDeliverables} trend="Deliverables" icon={<Package size={16} />} accent="default" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SectionHeader
            title="Your projects"
            description="Active and hiring projects"
            action={<Link to="/dashboard/business/projects" className="text-[12.5px] text-brand hover:underline inline-flex items-center gap-1">All projects <ArrowRight size={12}/></Link>}
          />
          <div className="space-y-3">
            {BUSINESS_PROJECTS.map((p) => (
              <Panel key={p.id} padding="p-5" hover>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <Link to={`/dashboard/business/projects/${p.id}/workspace`} className="flex-1">
                    <h3 className="text-[15px] font-semibold text-text hover:text-brand">{p.title}</h3>
                    <p className="mt-1 text-[12.5px] text-text-muted line-clamp-2">{p.description}</p>
                  </Link>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <DifficultyTag level={p.difficulty as Difficulty} />
                    <StatusTag label={p.status} variant={statusVariant(p.status)} />
                  </div>
                </div>
                <div className="flex items-center justify-between text-[12px] text-text-subtle">
                  <div className="flex gap-4">
                    <span>{p.budget}</span>
                    <span>{p.applicants} applicants</span>
                    <span>Due {p.deadline}</span>
                  </div>
                  <span>{p.progress}%</span>
                </div>
                <div className="mt-2"><ProgressBar value={p.progress} height={4} /></div>
              </Panel>
            ))}
          </div>
        </div>

        <aside>
          <SectionHeader
            title="Recent applicants"
            action={<Link to="/dashboard/business/applicants" className="text-[12.5px] text-brand hover:underline">View all</Link>}
          />
          <Panel padding="p-3">
            <ul className="divide-y divide-border-subtle">
              {BUSINESS_APPLICANTS.slice(0, 4).map((a) => (
                <li key={a.id} className="flex items-center gap-3 px-2 py-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-brand/15 text-[11px] font-semibold text-brand flex-shrink-0">
                    {a.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-text truncate">{a.name}</p>
                    <p className="text-[11px] text-text-subtle truncate">{a.projectTitle}</p>
                  </div>
                  <span className="text-[11px] text-text-subtle flex-shrink-0">★ {a.rating}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </aside>
      </div>
    </PageShell>
  );
}
