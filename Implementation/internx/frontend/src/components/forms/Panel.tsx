import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

interface PanelProps {
  children: ReactNode;
  className?: string;
  padding?: string;
  hover?: boolean;
}

export function Panel({ children, className = "", padding = "p-6", hover }: PanelProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border-default bg-surface-2 shadow-[0_1px_2px_rgba(0,0,0,0.4)]",
        hover && "transition-colors hover:border-border-strong",
        padding,
        className,
      )}
    >
      {children}
    </div>
  );
}
