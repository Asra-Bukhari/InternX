import { Panel } from "@/components/forms/Panel";
import { TaskList, type TaskItem } from "@/components/domain/TaskList";
import { GhostButton } from "@/components/forms/GhostButton";
import { Plus } from "lucide-react";
import { WORKSPACE_TASKS } from "@/lib/mock/business";

export function TasksTab() {
  const tasks: TaskItem[] = WORKSPACE_TASKS.map((t) => ({
    id: t.id,
    title: t.title,
    status: t.status as TaskItem["status"],
    dueDate: t.dueDate,
    priority: t.priority,
  }));
  return (
    <Panel padding="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[16px] font-semibold text-text">Tasks</h2>
          <p className="text-[12px] text-text-subtle">
            {tasks.filter((t) => t.status === "Completed").length} of {tasks.length} completed
          </p>
        </div>
        <GhostButton size="sm" icon={<Plus size={13} />}>Add task</GhostButton>
      </div>
      <TaskList tasks={tasks} />
    </Panel>
  );
}
