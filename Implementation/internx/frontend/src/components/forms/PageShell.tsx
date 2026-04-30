import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface PageShellProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function PageShell({ title, subtitle, actions, children, className }: PageShellProps) {
  return (
    <div className={cn("mx-auto max-w-[1440px] px-8 py-8", className)}>
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight text-text">{title}</h1>
          {subtitle && <p className="mt-1 text-[13.5px] text-text-subtle">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
