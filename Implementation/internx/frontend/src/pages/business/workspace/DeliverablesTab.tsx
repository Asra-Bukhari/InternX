import { useEffect, useState } from "react";
import { Package, AlertCircle, RotateCcw, CheckCircle2, Clock } from "lucide-react";
import { Panel } from "@/components/forms/Panel";
import { StatusTag } from "@/components/data-display/StatusTag";
import { EmptyState } from "@/components/feedback/EmptyState";
import { PrimaryButton } from "@/components/forms/PrimaryButton";
import { GhostButton } from "@/components/forms/GhostButton";
import { deliverablesApi, type BackendDeliverable } from "@/lib/api/payments";
import { ApiError } from "@/lib/api/client";
import type { BackendProject } from "@/types/project";

interface Props {
  projectId: string;
  project: BackendProject;
}

function formatDate(iso?: string): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return "";
  }
}

type DeliverableGroup = "completed" | "current" | "pending" | "rejected" | "upcoming";

interface GroupedItem {
  definition: (typeof BackendProject.prototype.deliverables)[number];
  index: number;
  group: DeliverableGroup;
  submission?: BackendDeliverable;
}

function groupDeliverables(
  definitions: typeof BackendProject.prototype.deliverables,
  submissions: BackendDeliverable[],
): GroupedItem[] {
  const result: GroupedItem[] = [];
  const sortedSubs = [...submissions].reverse();
  let foundCurrent = false;

  for (let i = 0; i < definitions.length; i++) {
    const def = definitions[i];
    const sub = sortedSubs[i];

    if (sub?.status === "approved") {
      result.push({ definition: def, index: i, group: "completed", submission: sub });
    } else if (sub?.status === "rejected") {
      result.push({ definition: def, index: i, group: "rejected", submission: sub });
    } else if (sub?.status === "pending") {
      result.push({ definition: def, index: i, group: "pending", submission: sub });
    } else if (!foundCurrent) {
      foundCurrent = true;
      result.push({ definition: def, index: i, group: "current", submission: sub });
    } else {
      result.push({ definition: def, index: i, group: "upcoming" });
    }
  }

  return result;
}

export function DeliverablesTab({ projectId, project }: Props) {
  const [submissions, setSubmissions] = useState<BackendDeliverable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await deliverablesApi.forProject(projectId);
        if (cancelled) return;
        setSubmissions(res);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Could not load deliverables.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  async function handleApprove(id: string) {
    setActionLoading(id);
    try {
      await deliverablesApi.approve(id);
      const res = await deliverablesApi.forProject(projectId);
      setSubmissions(res);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not approve deliverable.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject(id: string) {
    setActionLoading(id);
    try {
      await deliverablesApi.reject(id);
      const res = await deliverablesApi.forProject(projectId);
      setSubmissions(res);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not request revision.");
    } finally {
      setActionLoading(null);
    }
  }

  const definitions = project.deliverables ?? [];
  const grouped = groupDeliverables(definitions, submissions);

  if (loading) {
    return (
      <Panel padding="p-8" className="flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <p className="text-[13px] text-text-subtle">Loading deliverables…</p>
        </div>
      </Panel>
    );
  }

  if (error) {
    return (
      <div className="flex items-start gap-2 rounded-md border border-status-danger/30 bg-status-danger-soft px-3 py-2.5 text-[12.5px] text-status-danger">
        <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  if (definitions.length === 0) {
    return (
      <Panel padding="p-12">
        <EmptyState
          icon={<Package size={20} />}
          title="No deliverables defined"
          description="Add deliverables in project settings to track student submissions."
        />
      </Panel>
    );
  }

  const pending = grouped.filter((g) => g.group === "pending");
  const completed = grouped.filter((g) => g.group === "completed");
  const rejected = grouped.filter((g) => g.group === "rejected");
  const current = grouped.filter((g) => g.group === "current");
  const upcoming = grouped.filter((g) => g.group === "upcoming");

  const sections = [
    { items: pending, group: "pending" as DeliverableGroup, label: "Pending Review", icon: Clock, color: "text-status-warning" },
    { items: rejected, group: "rejected" as DeliverableGroup, label: "Needs Revision", icon: AlertCircle, color: "text-status-danger" },
    { items: current, group: "current" as DeliverableGroup, label: "Current Deliverable", icon: AlertCircle, color: "text-brand" },
    { items: completed, group: "completed" as DeliverableGroup, label: "Approved", icon: CheckCircle2, color: "text-status-success" },
    { items: upcoming, group: "upcoming" as DeliverableGroup, label: "Upcoming", icon: Clock, color: "text-text-subtle" },
  ].filter((s) => s.items.length > 0);

  return (
    <div className="space-y-6">
      {sections.map(({ items, group, label, icon: Icon, color }) => (
        <div key={group}>
          <div className={`flex items-center gap-2 mb-3 ${color}`}>
            <Icon size={15} />
            <h3 className="text-[13.5px] font-semibold">{label}</h3>
            <span className="text-[11px] opacity-60">({items.length})</span>
          </div>
          <div className="space-y-3">
            {items.map((item) => {
              const sub = item.submission;
              const def = item.definition;
              const statusBgColor =
                group === "pending"
                  ? "bg-status-warning-soft/10 border-status-warning/20"
                  : group === "rejected"
                  ? "bg-status-danger-soft/10 border-status-danger/20"
                  : group === "completed"
                  ? "bg-status-success-soft/10 border-status-success/20"
                  : group === "current"
                  ? "bg-brand/[0.03] border-brand/30"
                  : "bg-surface-2 border-border-subtle";

              return (
                <Panel key={sub?._id ?? item.index} padding="p-5" className={`border ${statusBgColor}`}>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-text">{def.title}</p>
                      {def.description && (
                        <p className="text-[12px] text-text-muted mt-1">{def.description}</p>
                      )}
                    </div>
                    {sub && (
                      <StatusTag
                        label={
                          sub.status === "approved"
                            ? "Approved"
                            : sub.status === "rejected"
                            ? "Rejected"
                            : "Pending"
                        }
                        variant={
                          sub.status === "approved"
                            ? "approved"
                            : sub.status === "rejected"
                            ? "revision"
                            : "pending"
                        }
                      />
                    )}
                  </div>

                  {sub && (
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-3 flex-wrap text-[11.5px] text-text-subtle">
                        <span>Submitted: {formatDate(sub.submittedAt)}</span>
                        {def.deadline && <span>Due: {def.deadline}</span>}
                        {def.paymentPercent && (
                          <span className="font-medium">💰 {def.paymentPercent}% payment</span>
                        )}
                      </div>
                      {sub.fileUrl && (
                        <div className="rounded-md border border-border-subtle bg-surface-2 px-3 py-2 text-[12px]">
                          <p className="text-text-subtle">📎 Submission</p>
                          <p className="text-text break-all font-mono text-[11px] mt-1">{sub.fileUrl}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {group === "pending" && sub && (
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-subtle">
                      <GhostButton
                        size="sm"
                        onClick={() => handleReject(sub._id)}
                        disabled={actionLoading === sub._id}
                        icon={<RotateCcw size={13} />}
                      >
                        Request Revision
                      </GhostButton>
                      <PrimaryButton
                        size="sm"
                        onClick={() => handleApprove(sub._id)}
                        disabled={actionLoading === sub._id}
                        icon={<CheckCircle2 size={13} />}
                      >
                        Approve
                      </PrimaryButton>
                    </div>
                  )}

                  {group === "rejected" && sub && (
                    <div className="text-[11.5px] text-text-subtle italic pt-2 border-t border-border-subtle">
                      Awaiting student resubmission
                    </div>
                  )}
                </Panel>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
