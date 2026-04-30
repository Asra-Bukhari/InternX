import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border-default bg-surface-2 px-6 py-12 text-center", className)}>
      {icon && <div className="text-text-subtle">{icon}</div>}
      <div>
        <h3 className="text-[15px] font-semibold text-text">{title}</h3>
        {description && <p className="mt-1 text-[13px] text-text-subtle">{description}</p>}
      </div>
      {action}
    </div>
  );
}
