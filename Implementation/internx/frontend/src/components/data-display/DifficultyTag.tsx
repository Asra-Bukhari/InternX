import { cn } from "@/lib/utils/cn";
import type { Difficulty } from "@/types/project";
import { DIFFICULTY_LABEL } from "@/types/project";

interface DifficultyTagProps {
  level: Difficulty;
  className?: string;
}

const classes: Record<Difficulty, string> = {
  easy: "bg-status-success-soft text-status-success",
  medium: "bg-status-info-soft text-status-info",
  hard: "bg-status-danger-soft text-status-danger",
};

export function DifficultyTag({ level, className }: DifficultyTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium",
        classes[level],
        className,
      )}
    >
      {DIFFICULTY_LABEL[level]}
    </span>
  );
}
