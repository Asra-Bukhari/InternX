import { cn } from "@/lib/utils/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  children: ReactNode;
}

const sizeMap = {
  sm: "h-8 px-3 text-[12.5px]",
  md: "h-9 px-4 text-[13px]",
  lg: "h-11 px-5 text-[14px]",
} as const;

export function PrimaryButton({
  size = "md",
  icon,
  children,
  className,
  disabled,
  ...rest
}: PrimaryButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors",
        "bg-brand text-brand-foreground shadow-[0_1px_2px_rgba(244,111,37,0.3)]",
        "hover:bg-[#E55F15]",
        disabled && "opacity-60 cursor-not-allowed shadow-none bg-[#3a2418]",
        sizeMap[size],
        className,
      )}
    >
      {icon}
      {children}
    </button>
  );
}
