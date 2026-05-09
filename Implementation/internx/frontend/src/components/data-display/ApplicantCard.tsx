import { Star, Award, GraduationCap, CheckCircle2, X, Eye } from "lucide-react";
import { Panel } from "@/components/forms/Panel";
import { GhostButton } from "@/components/forms/GhostButton";
import { PrimaryButton } from "@/components/forms/PrimaryButton";
import { SkillChip } from "@/components/data-display/SkillChip";
import { StatusTag } from "@/components/data-display/StatusTag";

export interface ApplicantViewModel {
  applicationId: string;
  studentId: string;
  name: string;
  initials: string;
  email: string;
  university?: string;
  level?: string;
  skills: string[];
  matchedTags: string[];
  testScore: number;
  whyMeEssay: string;
  status: "pending" | "accepted" | "rejected";
}

interface Props {
  applicant: ApplicantViewModel;
  disabled?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
  onView?: () => void;
}

export function ApplicantCard({ applicant, disabled, onAccept, onReject, onView }: Props) {
  const a = applicant;
  return (
    <Panel padding="p-5" className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-full bg-brand/15 text-[14px] font-semibold text-brand">
            {a.initials}
          </div>
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-text truncate">{a.name}</p>
            <p className="text-[12px] text-text-subtle truncate">{a.email}</p>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11.5px] text-text-muted">
              {a.university && (
                <span className="inline-flex items-center gap-1">
                  <GraduationCap size={11} /> {a.university}
                </span>
              )}
              {a.level && (
                <span className="inline-flex items-center gap-1">
                  <Award size={11} /> {a.level}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <StatusTag
            label={a.status[0].toUpperCase() + a.status.slice(1)}
            variant={a.status === "accepted" ? "approved" : a.status === "rejected" ? "rejected" : "pending"}
          />
          <span className="inline-flex items-center gap-1 text-[11.5px] text-text-muted">
            <Star size={11} className="text-status-warning fill-status-warning" />
            Test: {a.testScore}%
          </span>
        </div>
      </div>

      {a.skills.length > 0 && (
        <div>
          <p className="text-[11px] uppercase tracking-wider text-text-subtle mb-1.5">Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {a.skills.map((s) => (
              <SkillChip key={s} label={s} active={a.matchedTags.includes(s)} />
            ))}
          </div>
          {a.matchedTags.length > 0 && (
            <p className="mt-1 text-[11px] text-status-success">
              {a.matchedTags.length} matching tag{a.matchedTags.length === 1 ? "" : "s"}
            </p>
          )}
        </div>
      )}

      {a.whyMeEssay && (
        <div className="rounded-md border border-border-subtle bg-surface-2 px-3 py-2.5">
          <p className="text-[11px] uppercase tracking-wider text-text-subtle mb-1">Why me</p>
          <p className="text-[12.5px] text-text leading-relaxed line-clamp-4">{a.whyMeEssay}</p>
        </div>
      )}

      <div className="flex items-center gap-2 justify-end">
        {onView && (
          <GhostButton size="sm" onClick={onView} icon={<Eye size={13} />} disabled={disabled}>
            View
          </GhostButton>
        )}
        {a.status === "pending" && onReject && (
          <GhostButton size="sm" onClick={onReject} icon={<X size={13} />} disabled={disabled}>
            Reject
          </GhostButton>
        )}
        {a.status === "pending" && onAccept && (
          <PrimaryButton size="sm" onClick={onAccept} icon={<CheckCircle2 size={13} />} disabled={disabled}>
            Accept
          </PrimaryButton>
        )}
      </div>
    </Panel>
  );
}
