import { cn } from "@/lib/utils/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface GhostButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  children: ReactNode;
}

const sizeMap = {
  sm: "h-8 px-3 text-[12.5px]",
  md: "h-9 px-4 text-[13px]",
  lg: "h-11 px-5 text-[14px]",
} as const;

export function GhostButton({ size = "md", icon, children, className, ...rest }: GhostButtonProps) {
  return (
    <button
      {...rest}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors",
        "border border-border-strong bg-transparent text-text",
        "hover:bg-surface-3",
        sizeMap[size],
        className,
      )}
    >
      {icon}
      {children}
    </button>
  );
}
