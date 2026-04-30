import { useState } from "react";
import { Link } from "react-router";
import { PageShell } from "@/components/forms/PageShell";
import { Panel } from "@/components/forms/Panel";
import { StatusTag } from "@/components/data-display/StatusTag";
import { EmptyState } from "@/components/feedback/EmptyState";
import { APPLICATIONS } from "@/lib/mock/student";
import type { ApplicationStatus } from "@/types/application";
import { cn } from "@/lib/utils/cn";

const TABS: { key: ApplicationStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "shortlisted", label: "Shortlisted" },
  { key: "selected", label: "Selected" },
  { key: "rejected", label: "Rejected" },
];

export default function StudentApplications() {
  const [tab, setTab] = useState<ApplicationStatus | "all">("all");
  const filtered = tab === "all" ? APPLICATIONS : APPLICATIONS.filter((a) => a.status === tab);

  return (
    <PageShell title="My Applications" subtitle="Track every project you've applied to">
      <div className="flex items-center gap-1 border-b border-border-subtle mb-6">
        {TABS.map((t) => {
          const count = t.key === "all" ? APPLICATIONS.length : APPLICATIONS.filter((a) => a.status === t.key).length;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "relative px-3 py-2.5 text-[13px] transition-colors",
                active ? "text-brand" : "text-text-subtle hover:text-text",
              )}
            >
              {t.label}
              <span className="ml-1.5 inline-flex items-center justify-center rounded-md bg-surface-3 px-1.5 text-[10.5px] text-text-dim">
                {count}
              </span>
              {active && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand" />}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No applications here"
          description="When you apply to projects, they'll show up in this list."
          action={<Link to="/dashboard/student/projects" className="text-brand text-[13px] hover:underline">Browse projects →</Link>}
        />
      ) : (
        <ul className="space-y-3">
          {filtered.map((a) => (
            <Panel key={a.id} padding="p-5" className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="grid h-11 w-11 place-items-center rounded-md bg-surface-3 text-[12px] font-semibold text-text-dim flex-shrink-0">
                  {a.businessLogo}
                </div>
                <div className="min-w-0">
                  <Link to={`/dashboard/student/projects/${a.projectId}`} className="text-[14px] font-semibold text-text truncate hover:text-brand">
                    {a.projectTitle}
                  </Link>
                  <p className="text-[12px] text-text-subtle truncate">{a.business} · Applied {a.appliedAt}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-[13px] font-medium text-text">{a.budget}</span>
                <StatusTag label={a.status[0].toUpperCase() + a.status.slice(1)} variant={a.status} />
              </div>
            </Panel>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
