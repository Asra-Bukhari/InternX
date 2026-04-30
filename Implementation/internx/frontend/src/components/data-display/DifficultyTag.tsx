import { cn } from "@/lib/utils/cn";
import type { Difficulty } from "@/types/project";

interface DifficultyTagProps {
  level: Difficulty;
  className?: string;
}

const difficultyClasses: Record<Difficulty, string> = {
  Basic: "bg-status-success-soft text-status-success",
  Medium: "bg-status-info-soft text-status-info",
  Hard: "bg-status-warning-soft text-status-warning",
  Hardcore: "bg-status-danger-soft text-status-danger",
};

export function DifficultyTag({ level, className }: DifficultyTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium",
        difficultyClasses[level],
        className,
      )}
    >
      {level}
    </span>
  );
}
