import { Star } from "lucide-react";
import { Panel } from "@/components/forms/Panel";
import { SkillChip } from "@/components/data-display/SkillChip";
import { PrimaryButton } from "@/components/forms/PrimaryButton";
import { GhostButton } from "@/components/forms/GhostButton";

export interface ApplicantCardData {
  id: string;
  name: string;
  initials: string;
  university: string;
  level: string;
  rating: number;
  skills: string[];
  intro: string;
  appliedDate?: string;
}

interface ApplicantCardProps {
  applicant: ApplicantCardData;
  onSelect?: () => void;
  onMessage?: () => void;
  onView?: () => void;
}

export function ApplicantCard({ applicant, onSelect, onMessage, onView }: ApplicantCardProps) {
  return (
    <Panel hover className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/15 text-[14px] font-semibold text-brand">
            {applicant.initials}
          </div>
          <div>
            <h3 className="text-[15px] font-semibold tracking-tight text-text">{applicant.name}</h3>
            <p className="text-[12px] text-text-subtle">
              {applicant.university} · {applicant.level}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[13px] font-medium text-text-dim">
          <Star size={14} className="fill-status-warning text-status-warning" />
          {applicant.rating.toFixed(1)}
        </div>
      </div>

      <p className="text-[13px] leading-relaxed text-text-muted">{applicant.intro}</p>

      <div className="flex flex-wrap gap-1.5">
        {applicant.skills.map((s) => <SkillChip key={s} label={s} />)}
      </div>

      <div className="flex items-center justify-between border-t border-border-subtle pt-3">
        {applicant.appliedDate && (
          <span className="text-[11.5px] text-text-subtle">Applied {applicant.appliedDate}</span>
        )}
        <div className="ml-auto flex items-center gap-2">
          {onView && <GhostButton size="sm" onClick={onView}>View Profile</GhostButton>}
          {onMessage && <GhostButton size="sm" onClick={onMessage}>Invite to Chat</GhostButton>}
          {onSelect && <PrimaryButton size="sm" onClick={onSelect}>Select</PrimaryButton>}
        </div>
      </div>
    </Panel>
  );
}
