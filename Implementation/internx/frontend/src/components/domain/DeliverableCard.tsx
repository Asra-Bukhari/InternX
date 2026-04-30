import { CheckCircle2, RotateCcw } from "lucide-react";
import { Panel } from "@/components/forms/Panel";
import { StatusTag, type StatusVariant } from "@/components/data-display/StatusTag";
import { GhostButton } from "@/components/forms/GhostButton";
import { PrimaryButton } from "@/components/forms/PrimaryButton";

export interface DeliverableCardData {
  id: string;
  version: string;
  date: string;
  status: string;
  note?: string;
}

interface DeliverableCardProps {
  deliverable: DeliverableCardData;
  onApprove?: () => void;
  onRequestRevision?: () => void;
}

function variantFor(status: string): StatusVariant {
  const s = status.toLowerCase();
  if (s.includes("approv")) return "approved";
  if (s.includes("revision")) return "revision";
  if (s.includes("review") || s.includes("pending")) return "pending";
  if (s.includes("complet")) return "completed";
  return "info";
}

export function DeliverableCard({ deliverable, onApprove, onRequestRevision }: DeliverableCardProps) {
  return (
    <Panel padding="p-4" className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[14px] font-semibold text-text">Version {deliverable.version}</p>
          <p className="text-[11.5px] text-text-subtle">Submitted {deliverable.date}</p>
        </div>
        <StatusTag label={deliverable.status} variant={variantFor(deliverable.status)} />
      </div>
      {deliverable.note && (
        <p className="text-[12.5px] text-text-muted leading-relaxed border-l-2 border-border-strong pl-3">
          {deliverable.note}
        </p>
      )}
      {(onApprove || onRequestRevision) && (
        <div className="flex items-center justify-end gap-2 pt-1">
          {onRequestRevision && (
            <GhostButton size="sm" onClick={onRequestRevision} icon={<RotateCcw size={13} />}>
              Request Revision
            </GhostButton>
          )}
          {onApprove && (
            <PrimaryButton size="sm" onClick={onApprove} icon={<CheckCircle2 size={13} />}>
              Approve
            </PrimaryButton>
          )}
        </div>
      )}
    </Panel>
  );
}
