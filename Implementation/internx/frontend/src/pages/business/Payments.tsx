import { useEffect, useMemo, useState } from "react";
import { DollarSign, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { PageShell } from "@/components/forms/PageShell";
import { Panel } from "@/components/forms/Panel";
import { KPIStat } from "@/components/domain/KPIStat";
import { PaymentRow } from "@/components/domain/PaymentRow";
import { EmptyState } from "@/components/feedback/EmptyState";
import {
  paymentsApi,
  projectTitleOf,
  studentNameOf,
  type BackendPayment,
} from "@/lib/api/payments";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils/cn";

const TABS = ["All", "Pending", "Released"] as const;
type Tab = typeof TABS[number];

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return "";
  }
}

export default function BusinessPayments() {
  const [payments, setPayments] = useState<BackendPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("All");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await paymentsApi.myPayments();
        if (cancelled) return;
        setPayments(res);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Could not load payments.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const pending = payments.filter((p) => p.status === "pending");
    const paid = payments.filter((p) => p.status === "paid");
    const totalPaid = paid.reduce((s, p) => s + (p.amount || 0), 0);
    const totalPending = pending.reduce((s, p) => s + (p.amount || 0), 0);
    return { pending, paid, totalPaid, totalPending };
  }, [payments]);

  const filtered = useMemo(() => {
    if (tab === "Pending") return stats.pending;
    if (tab === "Released") return stats.paid;
    return payments;
  }, [tab, payments, stats]);

  async function onComplete(id: string) {
    try {
      await paymentsApi.complete(id);
      const res = await paymentsApi.myPayments();
      setPayments(res);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not release payment.");
    }
  }

  return (
    <PageShell title="Payments" subtitle="Funds, escrow, and payouts">
      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-md border border-status-danger/30 bg-status-danger-soft px-3 py-2.5 text-[12.5px] text-status-danger">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <KPIStat label="Total Paid" value={loading ? "—" : `$${stats.totalPaid.toLocaleString()}`} icon={<DollarSign size={16} />} accent="brand" />
        <KPIStat label="Pending" value={loading ? "—" : `$${stats.totalPending.toLocaleString()}`} trend={`${stats.pending.length} payment${stats.pending.length === 1 ? "" : "s"}`} icon={<Clock size={16} />} accent="info" />
        <KPIStat label="Released" value={loading ? "—" : stats.paid.length} trend="Lifetime payouts" icon={<CheckCircle2 size={16} />} accent="success" />
      </div>

      {!loading && payments.length === 0 ? (
        <Panel padding="p-12">
          <EmptyState
            icon={<DollarSign size={20} />}
            title="No payment history"
            description="Once you create payments for hired students, they'll appear here."
          />
        </Panel>
      ) : (
        <>
          <div className="flex items-center gap-1 border-b border-border-subtle mb-6">
            {TABS.map((t) => {
              const count =
                t === "All" ? payments.length : t === "Pending" ? stats.pending.length : stats.paid.length;
              const active = tab === t;
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
            <EmptyState title={`No ${tab.toLowerCase()} payments`} />
          ) : (
            <div className="space-y-3">
              {filtered.map((p) => (
                <PaymentRow
                  key={p._id}
                  payment={{
                    id: p._id,
                    projectTitle: projectTitleOf(p),
                    counterpart: studentNameOf(p),
                    amount: `$${p.amount.toLocaleString()}`,
                    status: p.status === "paid" ? "released" : "in-escrow",
                    date: formatDate(p.createdAt),
                  }}
                  onRelease={p.status === "pending" ? () => onComplete(p._id) : undefined}
                  counterpartLabel="Student"
                />
              ))}
            </div>
          )}
        </>
      )}
    </PageShell>
  );
}
