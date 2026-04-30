import { DollarSign, CheckCircle2, Clock } from "lucide-react";
import { Panel } from "@/components/forms/Panel";
import { StatusTag, type StatusVariant } from "@/components/data-display/StatusTag";
import { PrimaryButton } from "@/components/forms/PrimaryButton";

export interface PaymentRowData {
  id: string;
  projectTitle: string;
  counterpart: string;
  amount: string;
  status: "pending" | "released" | "in-escrow";
  date: string;
}

interface PaymentRowProps {
  payment: PaymentRowData;
  counterpartLabel?: string;
  onRelease?: () => void;
}

const variantMap: Record<PaymentRowData["status"], StatusVariant> = {
  pending: "pending",
  released: "completed",
  "in-escrow": "info",
};

const labelMap: Record<PaymentRowData["status"], string> = {
  pending: "Pending",
  released: "Released",
  "in-escrow": "In Escrow",
};

export function PaymentRow({ payment, counterpartLabel = "Student", onRelease }: PaymentRowProps) {
  const Icon = payment.status === "released" ? CheckCircle2 : Clock;
  return (
    <Panel padding="p-4" className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="grid h-10 w-10 place-items-center rounded-md bg-surface-3 text-text-dim flex-shrink-0">
          <DollarSign size={15} />
        </div>
        <div className="min-w-0">
          <p className="text-[13.5px] font-medium text-text truncate">{payment.projectTitle}</p>
          <p className="text-[11.5px] text-text-subtle truncate">
            {counterpartLabel}: {payment.counterpart} · {payment.date}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="text-[14px] font-semibold text-text">{payment.amount}</span>
        <StatusTag
          label={labelMap[payment.status]}
          variant={variantMap[payment.status]}
        />
        {onRelease && payment.status === "in-escrow" && (
          <PrimaryButton size="sm" onClick={onRelease} icon={<Icon size={13} />}>
            Release
          </PrimaryButton>
        )}
      </div>
    </Panel>
  );
}
