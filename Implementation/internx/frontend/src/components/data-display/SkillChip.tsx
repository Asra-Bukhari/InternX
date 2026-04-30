import { cn } from "@/lib/utils/cn";

interface SkillChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function SkillChip({ label, active, onClick, className }: SkillChipProps) {
  const isButton = typeof onClick === "function";
  const Component: React.ElementType = isButton ? "button" : "span";
  return (
    <Component
      onClick={onClick}
      className={cn(
        "rounded-md px-2.5 py-1 text-[11.5px] font-medium transition-colors border",
        active
          ? "bg-brand/15 text-brand border-brand/35"
          : "bg-surface-3 text-text-dim border-border-default",
        isButton && !active && "hover:bg-surface-3 hover:border-border-strong",
        className,
      )}
    >
      {label}
    </Component>
  );
}
