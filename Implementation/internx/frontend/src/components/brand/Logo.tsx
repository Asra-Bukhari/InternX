import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  variant?: "icon" | "graduation";
  suffix?: string;
  className?: string;
}

const sizeMap = {
  sm: { box: "h-7 w-7", icon: 14, text: "text-[14px]" },
  md: { box: "h-8 w-8", icon: 18, text: "text-[16px]" },
  lg: { box: "h-9 w-9", icon: 20, text: "text-[18px]" },
} as const;

export function Logo({ size = "md", showWordmark = true, variant = "icon", suffix, className }: LogoProps) {
  const s = sizeMap[size];
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "flex items-center justify-center rounded-lg bg-brand text-brand-foreground font-semibold",
          s.box,
        )}
      >
        {variant === "graduation" ? (
          <GraduationCap size={s.icon} className="text-white" strokeWidth={2.25} />
        ) : (
          <span className={cn("font-semibold", s.text === "text-[14px]" ? "text-[12px]" : "text-[13px]")}>iX</span>
        )}
      </span>
      {showWordmark && (
        <span className={cn("font-semibold tracking-tight text-text", s.text)}>
          InternX
          {suffix && <span className="text-text-subtle"> {suffix}</span>}
        </span>
      )}
    </span>
  );
}
