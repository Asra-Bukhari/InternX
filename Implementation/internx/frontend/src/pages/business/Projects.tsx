import { useState } from "react";
import { Link } from "react-router";
import { Plus, Eye, Users } from "lucide-react";
import { PageShell } from "@/components/forms/PageShell";
import { Panel } from "@/components/forms/Panel";
import { ProgressBar } from "@/components/data-display/ProgressBar";
import { StatusTag, type StatusVariant } from "@/components/data-display/StatusTag";
import { DifficultyTag } from "@/components/data-display/DifficultyTag";
import { PrimaryButton } from "@/components/forms/PrimaryButton";
import { GhostButton } from "@/components/forms/GhostButton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { BUSINESS_PROJECTS } from "@/lib/mock/business";
import type { Difficulty } from "@/types/project";
import { cn } from "@/lib/utils/cn";

const TABS = ["All", "In Progress", "Hiring", "Completed"] as const;
type Tab = typeof TABS[number];

function variantOf(status: string): StatusVariant {
  const lc = status.toLowerCase();
  if (lc.includes("progress")) return "in-progress";
  if (lc.includes("hiring")) return "info";
  if (lc.includes("complete")) return "completed";
  return "draft";
}

export default function BusinessProjects() {
  const [tab, setTab] = useState<Tab>("All");
  const filtered = tab === "All" ? BUSINESS_PROJECTS : BUSINESS_PROJECTS.filter((p) => p.status === tab);

  return (
    <PageShell
      title="Projects"
      subtitle="All projects you've posted"
      actions={
        <Link to="/dashboard/business/projects/new">
          <PrimaryButton size="md" icon={<Plus size={14} />}>New Project</PrimaryButton>
        </Link>
      }
    >
      <div className="flex items-center gap-1 border-b border-border-subtle mb-6">
        {TABS.map((t) => {
          const active = tab === t;
          const count = t === "All" ? BUSINESS_PROJECTS.length : BUSINESS_PROJECTS.filter((p) => p.status === t).length;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "relative px-3 py-2.5 text-[13px] transition-colors",
                active ? "text-brand" : "text-text-subtle hover:text-text",
              )}
            >
              {t}
              <span className="ml-1.5 inline-flex items-center justify-center rounded-md bg-surface-3 px-1.5 text-[10.5px] text-text-dim">{count}</span>
              {active && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand" />}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title={`No ${tab.toLowerCase()} projects`} description="Create one to start hiring." />
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {filtered.map((p) => (
            <Panel key={p.id} padding="p-5" hover>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-[15px] font-semibold text-text">{p.title}</h3>
                  <p className="mt-1 text-[12.5px] text-text-muted line-clamp-2">{p.description}</p>
                </div>
                <DifficultyTag level={p.difficulty as Difficulty} />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <StatusTag label={p.status} variant={variantOf(p.status)} />
                <span className="text-[11.5px] text-text-subtle">{p.budget} · Due {p.deadline} · {p.applicants} applicants</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11.5px] text-text-subtle">
                <span>{p.progress}% complete</span>
                {p.selectedStudent && <span>Hired: {p.selectedStudent}</span>}
              </div>
              <ProgressBar value={p.progress} height={4} className="mt-1.5" />
              <div className="mt-4 flex items-center gap-2 justify-end">
                <Link to={`/dashboard/business/projects/${p.id}/applicants`}>
                  <GhostButton size="sm" icon={<Users size={13} />}>Applicants</GhostButton>
                </Link>
                <Link to={`/dashboard/business/projects/${p.id}/workspace`}>
                  <PrimaryButton size="sm" icon={<Eye size={13} />}>Open Workspace</PrimaryButton>
                </Link>
              </div>
            </Panel>
          ))}
        </div>
      )}
    </PageShell>
  );
}
