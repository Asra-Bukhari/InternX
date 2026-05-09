import { useState } from "react";
import { X, Send, AlertCircle } from "lucide-react";
import { PrimaryButton } from "@/components/forms/PrimaryButton";
import { GhostButton } from "@/components/forms/GhostButton";
import { FormField } from "@/components/forms/FormField";
import { Textarea } from "@/components/ui/textarea";
import { applicationsApi } from "@/lib/api/applications";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/useAuth";
import { SkillChip } from "@/components/data-display/SkillChip";
import { cn } from "@/lib/utils/cn";

interface Props {
  projectId: string;
  projectTitle: string;
  matchedTags: string[];
  open: boolean;
  onClose: () => void;
  onApplied: () => void;
}

const MIN_WORDS = 50;
const MAX_WORDS = 100;

function wordCount(s: string) {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

export function ApplyModal({ projectId, projectTitle, matchedTags, open, onClose, onApplied }: Props) {
  const { user, profile } = useAuth();
  const [essay, setEssay] = useState("");
  const [aiTestScore] = useState(75); // placeholder until AI integration
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const wc = wordCount(essay);
  const validEssay = wc >= MIN_WORDS && wc <= MAX_WORDS;

  async function onSubmit() {
    if (!validEssay) {
      setError(`Essay must be between ${MIN_WORDS} and ${MAX_WORDS} words.`);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await applicationsApi.apply({
        projectId,
        whyMeEssay: essay,
        aiTestScore,
      });
      onApplied();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not submit application.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="w-full max-w-2xl rounded-lg border border-border-default bg-bg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
          <div>
            <h2 className="text-[16px] font-semibold text-text">Apply to {projectTitle}</h2>
            <p className="text-[12px] text-text-subtle mt-0.5">Submit your application — review takes 2–3 days.</p>
          </div>
          <button type="button" onClick={onClose} className="text-text-subtle hover:text-text">
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="flex items-start gap-2 rounded-md border border-status-danger/30 bg-status-danger-soft px-3 py-2.5 text-[12.5px] text-status-danger">
              <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* AI Test placeholder */}
          <div>
            <p className="text-[12.5px] font-medium text-text-dim mb-1.5">AI test score</p>
            <div className="rounded-md border border-border-default bg-surface-2 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-text">Placeholder score</span>
                <span className="text-[20px] font-bold text-brand">{aiTestScore}%</span>
              </div>
              <p className="text-[11.5px] text-text-subtle mt-1">
                Once AI tests are live, this score will be auto-generated from a project-specific quiz.
              </p>
            </div>
          </div>

          {/* Why me essay */}
          <FormField
            label="Why you?"
            hint={`${MIN_WORDS}–${MAX_WORDS} words · currently ${wc}`}
            required
            error={!validEssay && essay.length > 0 ? `Word count must be between ${MIN_WORDS} and ${MAX_WORDS}.` : undefined}
          >
            <Textarea
              rows={6}
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
              placeholder="What makes you a great fit for this project? Mention relevant projects, skills, and approach."
            />
          </FormField>
          <p
            className={cn(
              "text-[11.5px]",
              !validEssay ? "text-status-warning" : "text-status-success",
            )}
          >
            {wc < MIN_WORDS
              ? `Need at least ${MIN_WORDS - wc} more words.`
              : wc > MAX_WORDS
              ? `Trim ${wc - MAX_WORDS} words.`
              : "Word count OK."}
          </p>

          {/* Profile snapshot */}
          <div>
            <p className="text-[12.5px] font-medium text-text-dim mb-1.5">Profile snapshot (auto-attached)</p>
            <div className="rounded-md border border-border-default bg-surface-2 p-4 space-y-2 text-[12.5px]">
              <div className="flex justify-between">
                <span className="text-text-subtle">Name</span>
                <span className="text-text">{user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-subtle">University</span>
                <span className="text-text">{profile?.university || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-subtle">Verified</span>
                <span className="text-text">{user?.isVerified ? "Yes" : "No"}</span>
              </div>
              {profile?.skills && profile.skills.length > 0 && (
                <div>
                  <p className="text-text-subtle mb-1.5">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {profile.skills.map((s) => (
                      <SkillChip key={s} label={s} active={matchedTags.includes(s)} />
                    ))}
                  </div>
                </div>
              )}
              {matchedTags.length > 0 && (
                <p className="text-status-success text-[11.5px]">
                  {matchedTags.length} matching tag{matchedTags.length === 1 ? "" : "s"} with this project.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border-subtle px-5 py-3">
          <GhostButton size="md" onClick={onClose} disabled={submitting}>Cancel</GhostButton>
          <PrimaryButton size="md" onClick={onSubmit} icon={<Send size={14} />} disabled={submitting || !validEssay}>
            {submitting ? "Submitting…" : "Submit Application"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
