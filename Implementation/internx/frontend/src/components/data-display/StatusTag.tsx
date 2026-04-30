import { cn } from "@/lib/utils/cn";

export type StatusVariant =
  | "pending"
  | "shortlisted"
  | "rejected"
  | "selected"
  | "active"
  | "completed"
  | "draft"
  | "info"
  | "in-progress"
  | "scheduled"
  | "approved"
  | "revision";

interface StatusTagProps {
  label: string;
  variant?: StatusVariant;
  className?: string;
}

const variantClasses: Record<StatusVariant, string> = {
  pending: "bg-status-warning-soft text-status-warning",
  shortlisted: "bg-status-info-soft text-status-info",
  rejected: "bg-status-danger-soft text-status-danger",
  selected: "bg-status-success-soft text-status-success",
  active: "bg-brand/15 text-brand",
  completed: "bg-status-success-soft text-status-success",
  draft: "bg-text-subtle/15 text-text-muted",
  info: "bg-brand-2/25 text-[#5BA8DD]",
  "in-progress": "bg-brand/15 text-brand",
  scheduled: "bg-status-info-soft text-status-info",
  approved: "bg-status-success-soft text-status-success",
  revision: "bg-status-danger-soft text-status-danger",
};

export function StatusTag({ label, variant = "pending", className }: StatusTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11.5px] font-medium",
        variantClasses[variant],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
