import { DeliverableCard } from "@/components/domain/DeliverableCard";
import { WORKSPACE_DELIVERABLES } from "@/lib/mock/business";

export function DeliverablesTab() {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-[16px] font-semibold text-text">Deliverables</h2>
        <p className="text-[12px] text-text-subtle">Approve to release payment, or request a revision.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {WORKSPACE_DELIVERABLES.map((d) => (
          <DeliverableCard
            key={d.id}
            deliverable={{ id: d.id, version: d.version, date: d.date, status: d.status, note: d.note }}
            onApprove={() => {}}
            onRequestRevision={() => {}}
          />
        ))}
      </div>
    </div>
  );
}
