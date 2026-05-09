import { Video } from "lucide-react";
import { Panel } from "@/components/forms/Panel";
import { EmptyState } from "@/components/feedback/EmptyState";

export function MeetingsTab() {
  return (
    <Panel padding="p-12">
      <EmptyState
        icon={<Video size={20} />}
        title="Meetings coming soon"
        description="Per-minute paid meetings will be available once the backend supports them."
      />
    </Panel>
  );
}
