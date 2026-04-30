import { useParams, Link, useNavigate } from "react-router";
import { ArrowLeft, Briefcase, Clock, Users, Calendar } from "lucide-react";
import { PageShell } from "@/components/forms/PageShell";
import { Panel } from "@/components/forms/Panel";
import { DifficultyTag } from "@/components/data-display/DifficultyTag";
import { SkillChip } from "@/components/data-display/SkillChip";
import { PrimaryButton } from "@/components/forms/PrimaryButton";
import { GhostButton } from "@/components/forms/GhostButton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { PROJECTS } from "@/lib/mock/student";

export default function StudentProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = PROJECTS.find((p) => p.id === id);

  if (!project) {
    return (
      <PageShell title="Project not found">
        <EmptyState
          title="That project doesn't exist"
          description="It may have been removed or filled."
          action={<Link to="/dashboard/student/projects" className="text-brand text-[13px] hover:underline">← Back to projects</Link>}
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      title={project.title}
      subtitle={project.business}
      actions={
        <>
          <GhostButton size="md" icon={<ArrowLeft size={14} />} onClick={() => navigate(-1)}>
            Back
          </GhostButton>
          <PrimaryButton size="md">{project.applied ? "Application Sent" : "Apply Now"}</PrimaryButton>
        </>
      }
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Panel padding="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="grid h-12 w-12 place-items-center rounded-md bg-surface-3 text-[14px] font-semibold text-text-dim">
                {project.businessLogo}
              </div>
              <div>
                <p className="text-[12px] text-text-subtle">Posted by</p>
                <p className="text-[15px] font-semibold text-text">{project.business}</p>
              </div>
              <div className="ml-auto"><DifficultyTag level={project.difficulty} /></div>
            </div>

            <h2 className="text-[18px] font-semibold tracking-tight text-text mt-6">About this project</h2>
            <p className="mt-2 text-[14px] text-text-muted leading-relaxed whitespace-pre-line">
              {project.longDescription || project.description}
            </p>

            {project.scope && project.scope.length > 0 && (
              <>
                <h3 className="mt-6 text-[15px] font-semibold text-text">Scope</h3>
                <ul className="mt-2 space-y-1.5">
                  {project.scope.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-[13.5px] text-text-muted">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <h3 className="mt-6 text-[15px] font-semibold text-text">Required skills</h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {project.skills.map((s) => <SkillChip key={s} label={s} />)}
            </div>
          </Panel>
        </div>

        <aside className="space-y-4">
          <Panel padding="p-5">
            <h3 className="text-[14px] font-semibold text-text mb-4">Project details</h3>
            <ul className="space-y-3 text-[13px]">
              <li className="flex items-start justify-between gap-2"><span className="text-text-subtle inline-flex items-center gap-1.5"><Briefcase size={13}/>Budget</span><span className="text-text font-medium">{project.budget}</span></li>
              <li className="flex items-start justify-between gap-2"><span className="text-text-subtle inline-flex items-center gap-1.5"><Calendar size={13}/>Contract</span><span className="text-text font-medium">{project.contract}</span></li>
              <li className="flex items-start justify-between gap-2"><span className="text-text-subtle inline-flex items-center gap-1.5"><Clock size={13}/>Timeline</span><span className="text-text font-medium">{project.timeline}</span></li>
              <li className="flex items-start justify-between gap-2"><span className="text-text-subtle inline-flex items-center gap-1.5"><Users size={13}/>Applicants</span><span className="text-text font-medium">{project.applicants} / 10</span></li>
              <li className="flex items-start justify-between gap-2"><span className="text-text-subtle">Posted</span><span className="text-text font-medium">{project.posted}</span></li>
            </ul>
          </Panel>
          <PrimaryButton size="lg" className="w-full">Apply Now</PrimaryButton>
        </aside>
      </div>
    </PageShell>
  );
}
