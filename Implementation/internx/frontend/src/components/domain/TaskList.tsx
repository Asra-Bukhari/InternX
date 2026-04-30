import { Check, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface TaskItem {
  id: string;
  title: string;
  status: "Done" | "In Progress" | "Todo" | "Completed" | "Pending";
  due?: string;
  dueDate?: string;
  priority?: string;
}

interface TaskListProps {
  tasks: TaskItem[];
  className?: string;
}

function statusBadge(status: TaskItem["status"]) {
  const isDone = status === "Done" || status === "Completed";
  const isProgress = status === "In Progress";
  if (isDone) {
    return { icon: <Check size={12} />, label: status, cls: "bg-status-success-soft text-status-success" };
  }
  if (isProgress) {
    return { icon: <Clock size={12} />, label: status, cls: "bg-brand/15 text-brand" };
  }
  return { icon: <Circle size={12} />, label: status, cls: "bg-text-subtle/15 text-text-muted" };
}

export function TaskList({ tasks, className }: TaskListProps) {
  return (
    <ul className={cn("divide-y divide-border-subtle", className)}>
      {tasks.map((t) => {
        const b = statusBadge(t.status);
        return (
          <li key={t.id} className="flex items-center justify-between gap-3 py-3">
            <div className="flex items-center gap-3">
              <span className={cn("inline-flex h-5 items-center gap-1 rounded-md px-1.5 text-[10.5px] font-medium", b.cls)}>
                {b.icon}
                {b.label}
              </span>
              <span className={cn("text-[13.5px]", b.label === "Done" || b.label === "Completed" ? "text-text-subtle line-through" : "text-text")}>
                {t.title}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11.5px] text-text-subtle">
              {t.priority && <span className="rounded-md border border-border-default px-1.5 py-0.5">{t.priority}</span>}
              {(t.due || t.dueDate) && <span>{t.due ?? t.dueDate}</span>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
