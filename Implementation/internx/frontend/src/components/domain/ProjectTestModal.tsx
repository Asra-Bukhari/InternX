import { useState } from "react";
import { X, ShieldCheck, AlertCircle, Camera, ClipboardCheck } from "lucide-react";
import { useNavigate } from "react-router";
import { PrimaryButton } from "@/components/forms/PrimaryButton";
import { GhostButton } from "@/components/forms/GhostButton";
import { useAuth } from "@/lib/auth/useAuth";
import { aiApi } from "@/lib/api/ai";
import { ApiError } from "@/lib/api/client";

interface Props {
  open: boolean;
  onClose: () => void;
  projectId: string;
  projectTitle: string;
  projectDescription: string;
  skillsRequired: string[];
}

export function ProjectTestModal({
  open,
  onClose,
  projectId,
  projectTitle,
  projectDescription,
  skillsRequired,
}: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open || !user) return null;

  async function handleStart() {
    setLoading(true);
    setError(null);
    try {
      const res = await aiApi.generateProjectTest({
        studentId: user!.id,
        projectId,
        projectTitle,
        projectDescription,
        skillsRequired,
      });
      onClose();
      navigate(`/test/${res.testId}`, {
        state: {
          testId: res.testId,
          questions: res.questions,
          testType: "project_application",
          projectId: res.projectId,
          projectTitle,
        },
      });
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        setError("You are banned from applying to this project due to a cheating violation.");
      } else {
        setError(err instanceof ApiError ? err.message : "Failed to generate test.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-xl border border-border-default bg-bg shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-brand/15">
              <ClipboardCheck size={16} className="text-brand" />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-text">Skill Assessment Required</h2>
              <p className="text-[11.5px] text-text-subtle truncate max-w-[280px]">
                {projectTitle}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-text-subtle hover:text-text" disabled={loading}>
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

          <div className="rounded-lg border border-border-subtle bg-surface-2 p-5 space-y-3">
            <div className="flex items-center gap-2 text-[14px] font-semibold text-text">
              <ShieldCheck size={16} className="text-brand" />
              Before you apply
            </div>
            <p className="text-[13px] text-text-dim leading-relaxed">
              To apply for this project, you must first pass a skill assessment test based on the
              project requirements. The test has <span className="font-medium text-text">10 questions</span>{" "}
              and requires <span className="font-medium text-text">50% to pass</span>.
            </p>
            <div className="flex items-center gap-2 mt-2 rounded-md bg-status-warning-soft px-3 py-2 text-[12px] text-status-warning">
              <Camera size={13} />
              <span>Your webcam will be monitored during the test for proctoring.</span>
            </div>
          </div>

          {skillsRequired.length > 0 && (
            <div>
              <p className="text-[12px] text-text-subtle mb-2">Test will cover these skills:</p>
              <div className="flex flex-wrap gap-1.5">
                {skillsRequired.map((s) => (
                  <span
                    key={s}
                    className="rounded-md bg-surface-3 border border-border-subtle px-2 py-0.5 text-[11.5px] text-text-muted"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-border-subtle px-5 py-3">
          <GhostButton size="md" onClick={onClose} disabled={loading}>
            Cancel
          </GhostButton>
          <PrimaryButton
            size="md"
            onClick={handleStart}
            disabled={loading}
            icon={<ClipboardCheck size={14} />}
          >
            {loading ? "Generating Test…" : "Start Assessment"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
