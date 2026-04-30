import { cn } from "@/lib/utils/cn";

interface ProgressBarProps {
  value: number;
  max?: number;
  height?: number;
  className?: string;
  barClassName?: string;
}

export function ProgressBar({ value, max = 100, height = 6, className, barClassName }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  return (
    <div
      className={cn("w-full overflow-hidden rounded-full bg-[#1A1A1A]", className)}
      style={{ height }}
    >
      <div
        className={cn("h-full rounded-full bg-brand transition-all", barClassName)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
