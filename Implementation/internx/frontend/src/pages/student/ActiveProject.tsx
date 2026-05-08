import { Link } from "react-router";
import { FolderOpen } from "lucide-react";
import { PageShell } from "@/components/forms/PageShell";
import { Panel } from "@/components/forms/Panel";
import { EmptyState } from "@/components/feedback/EmptyState";

export default function StudentActiveProject() {
  return (
    <PageShell title="Active Project" subtitle="Your current project workspace">
      <Panel padding="p-12">
        <EmptyState
          icon={<FolderOpen size={20} />}
          title="No active project"
          description="You'll see your project workspace here once a business hires you."
          action={
            <Link to="/dashboard/student/projects" className="text-brand text-[13px] hover:underline">
              Browse open projects →
            </Link>
          }
        />
      </Panel>
    </PageShell>
  );
}
