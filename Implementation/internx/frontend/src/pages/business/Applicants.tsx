import { useState } from "react";
import { PageShell } from "@/components/forms/PageShell";
import { ApplicantCard } from "@/components/data-display/ApplicantCard";
import { EmptyState } from "@/components/feedback/EmptyState";
import { BUSINESS_APPLICANTS, BUSINESS_PROJECTS } from "@/lib/mock/business";
import { cn } from "@/lib/utils/cn";

export default function BusinessApplicants() {
  const projectIds = ["all", ...BUSINESS_PROJECTS.map((p) => p.id)];
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all"
    ? BUSINESS_APPLICANTS
    : BUSINESS_APPLICANTS.filter((a) => a.projectId === filter);

  return (
    <PageShell title="Applicants" subtitle={`${filtered.length} applicants across your projects`}>
      <div className="flex items-center gap-1 border-b border-border-subtle mb-6 overflow-x-auto">
        {projectIds.map((id) => {
          const label = id === "all" ? "All" : BUSINESS_PROJECTS.find((p) => p.id === id)?.title ?? id;
          const active = filter === id;
          return (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={cn(
                "relative px-3 py-2.5 text-[13px] transition-colors whitespace-nowrap",
                active ? "text-brand" : "text-text-subtle hover:text-text",
              )}
            >
              {label}
              {active && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand" />}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No applicants" />
      ) : (
        <div className="grid lg:grid-cols-2 gap-5">
          {filtered.map((a) => (
            <ApplicantCard
              key={a.id}
              applicant={a}
              onView={() => {}}
              onMessage={() => {}}
              onSelect={() => {}}
            />
          ))}
        </div>
      )}
    </PageShell>
  );
}
