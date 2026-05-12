import { useEffect, useState } from "react";
import { CheckCircle2, Clock, AlertCircle, CircleDot } from "lucide-react";
import { Panel } from "@/components/forms/Panel";
import { ProgressBar } from "@/components/data-display/ProgressBar";
import { StatusTag } from "@/components/data-display/StatusTag";
import { EmptyState } from "@/components/feedback/EmptyState";
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

export function TasksTab({ projectId, project }: Props) {
  const [submissions, setSubmissions] = useState<BackendDeliverable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const definitions = project.deliverables ?? [];
  const totalDel = definitions.length;
  const approvedCount = submissions.filter((s) => s.status === "approved").length;
  const pendingCount = submissions.filter((s) => s.status === "pending").length;
  const rejectedCount = submissions.filter((s) => s.status === "rejected").length;
  const completionPercent = totalDel > 0 ? Math.round((approvedCount / totalDel) * 100) : 0;

  if (loading) {
    return (
      <Panel padding="p-8" className="flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <p className="text-[13px] text-text-subtle">Loading progress…</p>
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

  if (totalDel === 0) {
    return (
      <Panel padding="p-12">
        <EmptyState
          icon={<Clock size={20} />}
          title="No deliverables defined"
          description="Create deliverables in the project setup to track progress."
        />
      </Panel>
    );
  }

  // Sort submissions oldest-first to match with deliverable positions
  const sortedSubs = [...submissions].reverse();

  return (
    <div className="space-y-6">
      {/* Progress summary cards */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Panel padding="p-4" className="text-center">
          <p className="text-[24px] font-bold text-brand">{completionPercent}%</p>
          <p className="text-[12px] text-text-subtle mt-1">Overall Progress</p>
        </Panel>
        <Panel padding="p-4" className="text-center">
          <p className="text-[24px] font-bold text-status-success">{approvedCount}</p>
          <p className="text-[12px] text-text-subtle mt-1">Completed</p>
        </Panel>
        <Panel padding="p-4" className="text-center">
          <p className="text-[24px] font-bold text-status-warning">{pendingCount}</p>
          <p className="text-[12px] text-text-subtle mt-1">Pending Review</p>
        </Panel>
        <Panel padding="p-4" className="text-center">
          <p className="text-[24px] font-bold text-status-danger">{rejectedCount}</p>
          <p className="text-[12px] text-text-subtle mt-1">Needs Revision</p>
        </Panel>
      </div>

      {/* Progress bar */}
      <Panel padding="p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[14px] font-semibold text-text">Project Completion</p>
          <span className="text-[13px] text-text-subtle">
            {approvedCount} of {totalDel} deliverables
          </span>
        </div>
        <ProgressBar value={completionPercent} />
      </Panel>

      {/* Timeline/progress tracker */}
      <Panel padding="p-6">
        <h3 className="text-[14px] font-semibold text-text mb-4">Progress Timeline</h3>
        <div className="space-y-3">
          {definitions.map((def, i) => {
            // Find submission for this position
            const subAtPos = sortedSubs[i];
            const isCompleted = subAtPos?.status === "approved";
            const isPending = subAtPos && subAtPos.status === "pending";
            const isRejected = subAtPos?.status === "rejected";
            const isUpcoming = !subAtPos;

            return (
              <div
                key={def._id ?? i}
                className={`flex items-start gap-3 rounded-lg border px-4 py-3 transition-colors ${
                  isCompleted
                    ? "border-status-success/20 bg-status-success-soft/10"
                    : isPending
                    ? "border-status-warning/20 bg-status-warning-soft/10"
                    : isRejected
                    ? "border-status-danger/20 bg-status-danger-soft/10"
                    : "border-border-subtle bg-surface-2"
                }`}
              >
                <div
                  className={`mt-0.5 h-3 w-3 rounded-full flex-shrink-0 ${
                    isCompleted
                      ? "bg-status-success"
                      : isPending
                      ? "bg-status-warning"
                      : isRejected
                      ? "bg-status-danger"
                      : isUpcoming && i === approvedCount
                      ? "bg-brand"
                      : "bg-border-strong"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className="text-[13px] font-medium text-text">{def.title}</p>
                    <span
                      className={`text-[11px] font-medium ${
                        isCompleted
                          ? "text-status-success"
                          : isPending
                          ? "text-status-warning"
                          : isRejected
                          ? "text-status-danger"
                          : i === approvedCount
                          ? "text-brand"
                          : "text-text-subtle"
                      }`}
                    >
                      {isCompleted ? "Approved" : isPending ? "Pending" : isRejected ? "Rejected" : "Upcoming"}
                    </span>
                  </div>
                  {def.description && (
                    <p className="text-[12px] text-text-muted mb-1">{def.description}</p>
                  )}
                  <div className="flex items-center gap-3 flex-wrap text-[11px] text-text-subtle">
                    {def.deadline && <span>Due: {def.deadline}</span>}
                    {def.paymentPercent && <span>💰 {def.paymentPercent}% payment</span>}
                    {subAtPos && <span>Submitted: {formatDate(subAtPos.submittedAt)}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}
