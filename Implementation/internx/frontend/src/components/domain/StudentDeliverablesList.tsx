import { Package, CheckCircle2, Clock, AlertTriangle, CircleDot } from "lucide-react";
import { Panel } from "@/components/forms/Panel";
import { StatusTag, type StatusVariant } from "@/components/data-display/StatusTag";
import { EmptyState } from "@/components/feedback/EmptyState";
import type { BackendDeliverable } from "@/lib/api/payments";
import type { ProjectDeliverable } from "@/types/project";

interface Props {
  projectId: string;
  projectDeliverables: ProjectDeliverable[];
  submissions: BackendDeliverable[];
}

function formatDate(iso?: string): string {
  if (!iso) return "";
  try { return new Date(iso).toLocaleDateString(); } catch { return ""; }
}

type DeliverableGroup = "completed" | "current" | "upcoming";

interface GroupedDeliverable {
  definition: ProjectDeliverable;
  index: number;
  group: DeliverableGroup;
  submission?: BackendDeliverable;
  latestStatus?: string;
}

function groupDeliverables(
  definitions: ProjectDeliverable[],
  submissions: BackendDeliverable[],
): GroupedDeliverable[] {
  const result: GroupedDeliverable[] = [];
  let foundCurrent = false;

  // Sort submissions oldest-first (API returns newest-first)
  const sortedSubs = [...submissions].reverse();

  for (let i = 0; i < definitions.length; i++) {
    const def = definitions[i];
    // Match submission at position i (oldest submission for this slot)
    // Keep only the latest submission if multiple resubmissions exist
    const submissionsAtSlot = sortedSubs.filter((_, si) => si === i);
    const sub = submissionsAtSlot[submissionsAtSlot.length - 1];

    if (sub?.status === "approved") {
      result.push({ definition: def, index: i, group: "completed", submission: sub, latestStatus: "approved" });
    } else if (!foundCurrent) {
      foundCurrent = true;
      result.push({
        definition: def, index: i, group: "current",
        submission: sub, latestStatus: sub?.status,
      });
    } else {
      result.push({ definition: def, index: i, group: "upcoming" });
    }
  }

  // If no definitions exist, show submissions as-is
  if (definitions.length === 0 && submissions.length > 0) {
    submissions.forEach((sub, i) => {
      result.push({
        definition: { title: `Submission ${submissions.length - i}` },
        index: i,
        group: sub.status === "approved" ? "completed" : "current",
        submission: sub,
        latestStatus: sub.status,
      });
    });
  }

  return result;
}

function statusVariant(status?: string): StatusVariant {
  switch (status) {
    case "approved": return "approved";
    case "rejected": return "revision";
    case "pending": return "pending";
    default: return "info";
  }
}

function statusLabel(status?: string): string {
  switch (status) {
    case "approved": return "Approved";
    case "rejected": return "Rejected — Resubmit";
    case "pending": return "Pending Review";
    default: return "Not Submitted";
  }
}

const groupConfig: Record<DeliverableGroup, { label: string; icon: typeof CheckCircle2; color: string }> = {
  completed: { label: "Completed Deliverables", icon: CheckCircle2, color: "text-status-success" },
  current: { label: "Current Deliverable", icon: CircleDot, color: "text-brand" },
  upcoming: { label: "Upcoming Deliverables", icon: Clock, color: "text-text-subtle" },
};

export function StudentDeliverablesList({ projectId, projectDeliverables, submissions }: Props) {
  const grouped = groupDeliverables(projectDeliverables, submissions);

  if (grouped.length === 0 && submissions.length === 0) {
    return (
      <Panel padding="p-8">
        <EmptyState
          icon={<Package size={18} />}
          title="No deliverables defined"
          description="The project doesn't have deliverables yet. You can still submit work using the form."
        />
      </Panel>
    );
  }

  const completed = grouped.filter((g) => g.group === "completed");
  const current = grouped.filter((g) => g.group === "current");
  const upcoming = grouped.filter((g) => g.group === "upcoming");

  return (
    <div className="space-y-6">
      {[
        { items: current, group: "current" as DeliverableGroup },
        { items: completed, group: "completed" as DeliverableGroup },
        { items: upcoming, group: "upcoming" as DeliverableGroup },
      ].filter((s) => s.items.length > 0).map(({ items, group }) => {
        const cfg = groupConfig[group];
        const Icon = cfg.icon;
        return (
          <div key={group}>
            <div className={`flex items-center gap-2 mb-3 ${cfg.color}`}>
              <Icon size={15} />
              <h3 className="text-[13.5px] font-semibold">{cfg.label}</h3>
              <span className="text-[11px] opacity-60">({items.length})</span>
            </div>
            <div className="space-y-2">
              {items.map((item) => (
                <Panel
                  key={item.index}
                  padding="p-4"
                  className={
                    group === "current"
                      ? "border-brand/30 bg-brand/[0.03]"
                      : group === "completed"
                        ? "border-status-success/20"
                        : "opacity-70"
                  }
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-[13.5px] font-medium text-text">{item.definition.title}</p>
                      {item.definition.description && (
                        <p className="text-[12px] text-text-muted mt-0.5 leading-relaxed">
                          {item.definition.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        {item.definition.deadline && (
                          <span className="text-[11px] text-text-subtle flex items-center gap-1">
                            <Clock size={11} /> Due: {item.definition.deadline}
                          </span>
                        )}
                        {item.definition.paymentPercent ? (
                          <span className="text-[11px] text-text-subtle">
                            💰 {item.definition.paymentPercent}% payment
                          </span>
                        ) : null}
                        {item.submission && (
                          <span className="text-[11px] text-text-subtle">
                            Submitted: {formatDate(item.submission.submittedAt)}
                          </span>
                        )}
                      </div>
                      {item.submission?.fileUrl && (
                        <p className="text-[11.5px] text-text-muted mt-1 break-all">
                          📎 {item.submission.fileUrl}
                        </p>
                      )}
                    </div>
                    <StatusTag
                      label={statusLabel(item.latestStatus)}
                      variant={statusVariant(item.latestStatus)}
                    />
                  </div>
                  {item.latestStatus === "rejected" && (
                    <div className="mt-2 flex items-start gap-2 rounded-md border border-status-danger/20 bg-status-danger-soft/50 px-3 py-2 text-[12px] text-status-danger">
                      <AlertTriangle size={13} className="mt-0.5 flex-shrink-0" />
                      <span>This deliverable was rejected. Please resubmit with corrections.</span>
                    </div>
                  )}
                </Panel>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
