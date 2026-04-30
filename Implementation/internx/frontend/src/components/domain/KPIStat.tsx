import type { ReactNode } from "react";
import { Panel } from "@/components/forms/Panel";

interface KPIStatProps {
  label: string;
  value: string | number;
  trend?: string;
  icon?: ReactNode;
  accent?: "brand" | "success" | "warning" | "info" | "default";
}

const accentClasses = {
  brand: "bg-brand/15 text-brand",
  success: "bg-status-success-soft text-status-success",
  warning: "bg-status-warning-soft text-status-warning",
  info: "bg-status-info-soft text-status-info",
  default: "bg-surface-3 text-text-dim",
} as const;

export function KPIStat({ label, value, trend, icon, accent = "default" }: KPIStatProps) {
  return (
    <Panel padding="p-5" className="flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <p className="text-[12px] font-medium text-text-subtle uppercase tracking-wider">{label}</p>
        {icon && (
          <div className={`grid h-8 w-8 place-items-center rounded-md ${accentClasses[accent]}`}>
            {icon}
          </div>
        )}
      </div>
      <p className="text-[26px] font-semibold tracking-tight text-text">{value}</p>
      {trend && <p className="text-[11.5px] text-text-subtle">{trend}</p>}
    </Panel>
  );
}
