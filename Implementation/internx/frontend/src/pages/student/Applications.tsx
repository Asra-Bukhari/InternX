import { Link } from "react-router";
import { FileText } from "lucide-react";
import { PageShell } from "@/components/forms/PageShell";
import { EmptyState } from "@/components/feedback/EmptyState";

export default function StudentApplications() {
  return (
    <PageShell title="My Applications" subtitle="Track every project you've applied to">
      <EmptyState
        icon={<FileText size={20} />}
        title="No applications yet"
        description="When you apply to projects, they'll show up in this list."
        action={
          <Link to="/dashboard/student/projects" className="text-brand text-[13px] hover:underline">
            Browse projects →
          </Link>
        }
      />
    </PageShell>
  );
}
