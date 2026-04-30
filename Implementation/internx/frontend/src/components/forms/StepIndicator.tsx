import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StepIndicatorProps {
  current: number;
  total: number;
  labels?: string[];
}

export function StepIndicator({ current, total, labels }: StepIndicatorProps) {
  const steps = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-[11.5px] text-text-subtle">
        <span className="font-medium text-text-dim">Step {current} of {total}</span>
        {labels?.[current - 1] && <span>{labels[current - 1]}</span>}
      </div>
      <div className="flex items-center gap-2">
        {steps.map((s, i) => {
          const isDone = s < current;
          const isActive = s === current;
          return (
            <div key={s} className="flex items-center flex-1">
              <div
                className={cn(
                  "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors",
                  isDone && "bg-brand text-brand-foreground",
                  isActive && "bg-brand/20 border border-brand/50 text-brand",
                  !isDone && !isActive && "bg-surface-3 text-text-subtle",
                )}
              >
                {isDone ? <Check size={13} /> : s}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "ml-2 h-[2px] flex-1 rounded-full transition-colors",
                    s < current ? "bg-brand" : "bg-surface-3",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
