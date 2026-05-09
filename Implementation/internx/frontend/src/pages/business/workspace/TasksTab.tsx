import { ListChecks } from "lucide-react";
import { Panel } from "@/components/forms/Panel";
import { EmptyState } from "@/components/feedback/EmptyState";

export function TasksTab() {
  return (
    <Panel padding="p-12">
      <EmptyState
        icon={<ListChecks size={20} />}
        title="Tasks coming soon"
        description="Task management for projects will be available once the backend supports it."
      />
    </Panel>
  );
}
