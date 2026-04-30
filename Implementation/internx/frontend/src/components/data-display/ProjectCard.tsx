import { Link } from "react-router";
import { Clock, Users, Briefcase } from "lucide-react";
import { Panel } from "@/components/forms/Panel";
import { DifficultyTag } from "@/components/data-display/DifficultyTag";
import { SkillChip } from "@/components/data-display/SkillChip";
import type { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
  /** Where clicking the card navigates. */
  href?: string;
  /** Optional CTA to show in the bottom-right corner. */
  cta?: React.ReactNode;
  showApplicants?: boolean;
}

export function ProjectCard({ project, href, cta, showApplicants = true }: ProjectCardProps) {
  const body = (
    <Panel hover className="flex h-full flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-surface-3 text-[12px] font-semibold text-text-dim">
            {project.businessLogo}
          </div>
          <div>
            <p className="text-[11.5px] font-medium text-text-subtle">{project.business}</p>
            <h3 className="text-[15px] font-semibold tracking-tight text-text">{project.title}</h3>
          </div>
        </div>
        <DifficultyTag level={project.difficulty} />
      </div>

      <p className="text-[13px] leading-relaxed text-text-muted line-clamp-2">{project.description}</p>

      <div className="flex flex-wrap gap-1.5">
        {project.skills.slice(0, 4).map((s) => (
          <SkillChip key={s} label={s} />
        ))}
        {project.skills.length > 4 && (
          <span className="text-[11px] text-text-subtle self-center">+{project.skills.length - 4}</span>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-border-subtle pt-3">
        <div className="flex items-center gap-4 text-[12px] text-text-subtle">
          <span className="inline-flex items-center gap-1.5">
            <Briefcase size={13} />
            {project.budget}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock size={13} />
            {project.timeline}
          </span>
          {showApplicants && (
            <span className="inline-flex items-center gap-1.5">
              <Users size={13} />
              {project.applicants}
            </span>
          )}
        </div>
        {cta}
      </div>
    </Panel>
  );

  if (href) {
    return (
      <Link to={href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-xl">
        {body}
      </Link>
    );
  }
  return body;
}
