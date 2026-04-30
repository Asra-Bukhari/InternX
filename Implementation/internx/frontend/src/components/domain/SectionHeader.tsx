import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function SectionHeader({ title, description, action }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-3 mb-4">
      <div>
        <h2 className="text-[16px] font-semibold tracking-tight text-text">{title}</h2>
        {description && <p className="mt-0.5 text-[12.5px] text-text-subtle">{description}</p>}
      </div>
      {action}
    </div>
  );
}
