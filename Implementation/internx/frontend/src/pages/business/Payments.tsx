import { useState } from "react";
import { PageShell } from "@/components/forms/PageShell";
import { KPIStat } from "@/components/domain/KPIStat";
import { PaymentRow } from "@/components/domain/PaymentRow";
import { EmptyState } from "@/components/feedback/EmptyState";
import { DollarSign, CheckCircle2, Clock } from "lucide-react";
import { BUSINESS_PAYMENTS, BUSINESS } from "@/lib/mock/business";
import { cn } from "@/lib/utils/cn";

const TABS = ["All", "In Escrow", "Released", "Pending"] as const;
type Tab = typeof TABS[number];

const TAB_TO_STATUS: Record<Tab, string | null> = {
  All: null,
  "In Escrow": "in-escrow",
  Released: "released",
  Pending: "pending",
};

export default function BusinessPayments() {
  const [tab, setTab] = useState<Tab>("All");
  const filterStatus = TAB_TO_STATUS[tab];
  const filtered = filterStatus
    ? BUSINESS_PAYMENTS.filter((p) => p.status === filterStatus)
    : BUSINESS_PAYMENTS;

  const inEscrow = BUSINESS_PAYMENTS.filter((p) => p.status === "in-escrow");
  const released = BUSINESS_PAYMENTS.filter((p) => p.status === "released");
  const totalEscrow = inEscrow.reduce((sum, p) => sum + parseFloat(p.amount.replace(/[$,]/g, "")), 0);

  return (
    <PageShell title="Payments" subtitle="Funds, escrow, and payouts">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <KPIStat label="Total Spent" value={`$${BUSINESS.totalSpent.toLocaleString()}`} icon={<DollarSign size={16} />} accent="brand" />
        <KPIStat label="In Escrow" value={`$${totalEscrow.toLocaleString()}`} trend={`${inEscrow.length} projects`} icon={<Clock size={16} />} accent="info" />
        <KPIStat label="Released" value={released.length} trend="Lifetime payouts" icon={<CheckCircle2 size={16} />} accent="success" />
      </div>

      <div className="flex items-center gap-1 border-b border-border-subtle mb-6">
        {TABS.map((t) => {
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
              {active && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand" />}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No payments here" />
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <PaymentRow
              key={p.id}
              payment={{
                id: p.id,
                projectTitle: p.projectTitle,
                counterpart: p.student,
                amount: p.amount,
                status: p.status,
                date: p.date,
              }}
              onRelease={() => {}}
            />
          ))}
        </div>
      )}
    </PageShell>
  );
}
