import { Link } from "react-router";
import { Clock, Users, Briefcase, Hourglass } from "lucide-react";
import { Panel } from "@/components/forms/Panel";
import { DifficultyTag } from "@/components/data-display/DifficultyTag";
import { SkillChip } from "@/components/data-display/SkillChip";
import {
  type BackendProject,
  applicantsCount,
  remainingSlots,
  projectOwnerName,
  projectOwnerInitials,
  relativePostedAt,
  CONTRACT_LABEL,
} from "@/types/project";

interface ProjectCardProps {
  project: BackendProject;
  href?: string;
  cta?: React.ReactNode;
}

function budgetLabel(p: BackendProject): string {
  return p.budget && p.budget > 0 ? `$${p.budget.toLocaleString()}` : "—";
}

export function ProjectCard({ project: p, href, cta }: ProjectCardProps) {
  const skills = p.skillsRequired ?? [];
  const slots = remainingSlots(p);

  const body = (
    <Panel hover className="flex h-full flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-surface-3 text-[12px] font-semibold text-text-dim">
            {projectOwnerInitials(p)}
          </div>
          <div className="min-w-0">
            <p className="text-[11.5px] font-medium text-text-subtle truncate">
              {projectOwnerName(p)}
            </p>
            <h3 className="text-[15px] font-semibold tracking-tight text-text truncate">
              {p.title}
            </h3>
          </div>
        </div>
        <DifficultyTag level={p.difficulty} />
      </div>

      <p className="text-[13px] leading-relaxed text-text-muted line-clamp-2">
        {p.summary || p.description}
      </p>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {skills.slice(0, 4).map((s) => (
            <SkillChip key={s} label={s} />
          ))}
          {skills.length > 4 && (
            <span className="text-[11px] text-text-subtle self-center">+{skills.length - 4}</span>
          )}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between border-t border-border-subtle pt-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-text-subtle">
          <span className="inline-flex items-center gap-1.5">
            <Briefcase size={13} />
            {budgetLabel(p)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Hourglass size={13} />
            {p.durationLabel || CONTRACT_LABEL[p.contractType]}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users size={13} />
            {applicantsCount(p)} / 10
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock size={13} />
            {relativePostedAt(p)}
          </span>
        </div>
        {cta}
      </div>
      {slots === 0 && (
        <span className="inline-flex items-center self-start rounded-md bg-status-warning-soft px-2 py-0.5 text-[10.5px] font-medium text-status-warning">
          Slots full
        </span>
      )}
    </Panel>
  );

  if (href) return <Link to={href} className="h-full">{body}</Link>;
  return body;
}
