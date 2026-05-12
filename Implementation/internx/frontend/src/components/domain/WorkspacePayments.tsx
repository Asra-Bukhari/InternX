import { useEffect, useState } from "react";
import { DollarSign, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Panel } from "@/components/forms/Panel";
import { StatusTag } from "@/components/data-display/StatusTag";
import { EmptyState } from "@/components/feedback/EmptyState";
import { paymentsApi, projectTitleOf, type BackendPayment } from "@/lib/api/payments";
import { ApiError } from "@/lib/api/client";
import type { BackendProject } from "@/types/project";

interface Props {
  project: BackendProject;
}

function formatDate(iso?: string): string {
  if (!iso) return "";
  try { return new Date(iso).toLocaleDateString(); } catch { return ""; }
}

export function WorkspacePayments({ project }: Props) {
  const [payments, setPayments] = useState<BackendPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const all = await paymentsApi.myPayments();
        if (cancelled) return;
        // Filter to this project only
        const projectPayments = all.filter((p) => {
          const pid = typeof p.projectId === "string" ? p.projectId : p.projectId._id;
          return pid === project._id;
        });
        setPayments(projectPayments);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Could not load payments.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [project._id]);

  // Compute per-deliverable payment breakdown
  const budget = project.budget ?? 0;
  const deliverables = project.deliverables ?? [];
  const totalPayment = payments.reduce((sum, p) => sum + (p.amount ?? 0), 0);
  const isPaid = payments.some((p) => p.status === "paid");

  if (loading) {
    return (
      <Panel padding="p-8" className="flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <p className="text-[13px] text-text-subtle">Loading payments…</p>
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

  return (
    <div className="space-y-6">
      {/* Payment summary */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Panel padding="p-5" className="text-center">
          <DollarSign size={20} className="mx-auto text-brand mb-2" />
          <p className="text-[22px] font-bold text-text">{budget ? `$${budget.toLocaleString()}` : "—"}</p>
          <p className="text-[12px] text-text-subtle mt-1">Total Budget</p>
        </Panel>
        <Panel padding="p-5" className="text-center">
          <CheckCircle2 size={20} className={`mx-auto mb-2 ${isPaid ? "text-status-success" : "text-text-subtle"}`} />
          <p className={`text-[22px] font-bold ${isPaid ? "text-status-success" : "text-text"}`}>
            {isPaid ? `$${totalPayment.toLocaleString()}` : "$0"}
          </p>
          <p className="text-[12px] text-text-subtle mt-1">Received</p>
        </Panel>
        <Panel padding="p-5" className="text-center">
          <Clock size={20} className={`mx-auto mb-2 ${!isPaid && payments.length > 0 ? "text-status-warning" : "text-text-subtle"}`} />
          <p className="text-[22px] font-bold text-text">
            {!isPaid && payments.length > 0 ? `$${totalPayment.toLocaleString()}` : isPaid ? "$0" : "—"}
          </p>
          <p className="text-[12px] text-text-subtle mt-1">Pending</p>
        </Panel>
      </div>

      {/* Per-deliverable breakdown */}
      {deliverables.length > 0 && (
        <Panel padding="p-6">
          <h3 className="text-[14px] font-semibold text-text mb-4">Payment Breakdown by Deliverable</h3>
          <div className="space-y-2">
            {deliverables.map((d, i) => {
              const amount = d.paymentPercent && budget ? Math.round((d.paymentPercent / 100) * budget) : 0;
              // Simple heuristic: if project payment is "paid", all deliverables are paid
              const delPaid = isPaid;
              const delPending = !isPaid && payments.length > 0;
              return (
                <div
                  key={d._id ?? i}
                  className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-3 ${
                    delPaid
                      ? "border-status-success/20 bg-status-success-soft/20"
                      : "border-border-subtle bg-surface-2"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-text">{d.title}</p>
                    {d.paymentPercent ? (
                      <p className="text-[11.5px] text-text-subtle">{d.paymentPercent}% of budget</p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-[14px] font-semibold ${delPaid ? "text-status-success" : "text-text"}`}>
                      {amount > 0 ? `$${amount.toLocaleString()}` : "—"}
                    </span>
                    <StatusTag
                      label={delPaid ? "Paid" : delPending ? "Payment Pending" : "Awaiting Approval"}
                      variant={delPaid ? "completed" : delPending ? "pending" : "info"}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      )}

      {/* Payment history */}
      {payments.length > 0 ? (
        <Panel padding="p-6">
          <h3 className="text-[14px] font-semibold text-text mb-4">Payment Records</h3>
          <div className="space-y-2">
            {payments.map((p) => (
              <div
                key={p._id}
                className={`flex items-center justify-between gap-4 rounded-lg border px-4 py-3 ${
                  p.status === "paid"
                    ? "border-status-success/20 bg-status-success-soft/20"
                    : "border-border-subtle bg-surface-2"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="grid h-10 w-10 place-items-center rounded-md bg-surface-3 text-text-dim flex-shrink-0">
                    <DollarSign size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-medium text-text truncate">{projectTitleOf(p)}</p>
                    <p className="text-[11.5px] text-text-subtle">{formatDate(p.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-[14px] font-semibold ${p.status === "paid" ? "text-status-success" : "text-text"}`}>
                    ${p.amount?.toLocaleString() ?? "0"}
                  </span>
                  <StatusTag
                    label={p.status === "paid" ? "Paid" : "Payment Pending"}
                    variant={p.status === "paid" ? "completed" : "pending"}
                  />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      ) : (
        <Panel padding="p-8">
          <EmptyState
            icon={<DollarSign size={18} />}
            title="No payment records yet"
            description="Payment records will appear here once the business initiates payment for this project."
          />
        </Panel>
      )}
    </div>
  );
}
