import { FolderOpen } from "lucide-react";
import { Panel } from "@/components/forms/Panel";
import { EmptyState } from "@/components/feedback/EmptyState";

export function FilesTab() {
  return (
    <Panel padding="p-12">
      <EmptyState
        icon={<FolderOpen size={20} />}
        title="No general files yet"
        description="Use the Deliverables tab to view work submitted by the student. General file sharing requires backend support."
      />
    </Panel>
  );
}
