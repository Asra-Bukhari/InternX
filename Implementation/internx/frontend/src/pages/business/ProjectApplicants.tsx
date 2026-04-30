import { useParams, Link, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/forms/PageShell";
import { Panel } from "@/components/forms/Panel";
import { ApplicantCard } from "@/components/data-display/ApplicantCard";
import { GhostButton } from "@/components/forms/GhostButton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { BUSINESS_PROJECTS, BUSINESS_APPLICANTS } from "@/lib/mock/business";

export default function BusinessProjectApplicants() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = BUSINESS_PROJECTS.find((p) => p.id === id);
  const applicants = BUSINESS_APPLICANTS.filter((a) => a.projectId === id);

  if (!project) {
    return (
      <PageShell title="Project not found">
        <EmptyState title="Project missing" action={<Link to="/dashboard/business/projects" className="text-brand text-[13px]">← Back</Link>} />
      </PageShell>
    );
  }

  return (
    <PageShell
      title={project.title}
      subtitle={`${applicants.length} of 10 applicants`}
      actions={<GhostButton icon={<ArrowLeft size={14} />} onClick={() => navigate(-1)}>Back</GhostButton>}
    >
      <Panel padding="p-5" className="mb-6">
        <p className="text-[13px] text-text-muted leading-relaxed">{project.description}</p>
        <div className="mt-3 text-[12px] text-text-subtle">
          {project.budget} · Due {project.deadline} · {project.difficulty}
        </div>
      </Panel>

      {applicants.length === 0 ? (
        <EmptyState title="No applicants yet" description="Applications close at 10 students." />
      ) : (
        <div className="grid lg:grid-cols-2 gap-5">
          {applicants.map((a) => (
            <ApplicantCard
              key={a.id}
              applicant={a}
              onView={() => {}}
              onMessage={() => {}}
              onSelect={() => {}}
            />
          ))}
        </div>
      )}
    </PageShell>
  );
}
