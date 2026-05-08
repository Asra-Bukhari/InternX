import { MessageSquare } from "lucide-react";
import { PageShell } from "@/components/forms/PageShell";
import { Panel } from "@/components/forms/Panel";
import { EmptyState } from "@/components/feedback/EmptyState";

export default function StudentMessages() {
  return (
    <PageShell title="Messages" subtitle="Conversations with businesses">
      <Panel padding="p-12">
        <EmptyState
          icon={<MessageSquare size={20} />}
          title="No conversations yet"
          description="When a business engages you on a project, your conversations appear here."
        />
      </Panel>
    </PageShell>
  );
}
