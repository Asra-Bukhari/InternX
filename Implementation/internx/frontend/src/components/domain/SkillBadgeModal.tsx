import { useState } from "react";
import { X, ShieldCheck, AlertCircle, Sparkles, Camera } from "lucide-react";
import { useNavigate } from "react-router";
import { PrimaryButton } from "@/components/forms/PrimaryButton";
import { GhostButton } from "@/components/forms/GhostButton";
import { useAuth } from "@/lib/auth/useAuth";
import { aiApi } from "@/lib/api/ai";
import { ApiError } from "@/lib/api/client";
import { SKILLS_OPTIONS } from "@/lib/constants/skills";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SkillBadgeModal({ open, onClose }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<"info" | "select">("info");
  const [skillTopic, setSkillTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open || !user) return null;

  const selectedTopic = skillTopic === "__custom" ? customTopic.trim() : skillTopic;

  async function handleStart() {
    if (!selectedTopic) {
      setError("Please select or enter a skill topic.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await aiApi.generateSkillTest(user!.id, selectedTopic);
      onClose();
      navigate(`/test/${res.testId}`, {
        state: {
          testId: res.testId,
          questions: res.questions,
          testType: "skill_badge",
          skillTopic: res.skillTopic,
        },
      });
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        setError("You are banned from this test due to a cheating violation.");
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
              <Sparkles size={16} className="text-brand" />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-text">Add Skill Badge</h2>
              <p className="text-[11.5px] text-text-subtle">Prove your skills with a proctored test</p>
            </div>
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

          {step === "info" && (
            <>
              <div className="rounded-lg border border-border-subtle bg-surface-2 p-5 space-y-3">
                <div className="flex items-center gap-2 text-[14px] font-semibold text-text">
                  <ShieldCheck size={16} className="text-brand" />
                  How it works
                </div>
                <ul className="space-y-2 text-[13px] text-text-dim leading-relaxed">
                  <li className="flex gap-2">
                    <span className="flex-shrink-0 text-brand">1.</span>
                    You'll take a <span className="font-medium text-text">10-question test</span> including MCQ, coding, and short answer questions.
                  </li>
                  <li className="flex gap-2">
                    <span className="flex-shrink-0 text-brand">2.</span>
                    A minimum score of <span className="font-medium text-text">50%</span> is required to earn the badge.
                  </li>
                  <li className="flex gap-2">
                    <span className="flex-shrink-0 text-brand">3.</span>
                    Your <span className="font-medium text-text">webcam will be active</span> during the test for proctoring.
                  </li>
                </ul>
                <div className="flex items-center gap-2 mt-2 rounded-md bg-status-info-soft px-3 py-2 text-[12px] text-status-info">
                  <Camera size={13} />
                  <span>Camera access is required. Make sure your webcam is connected.</span>
                </div>
              </div>

              <div className="flex justify-end">
                <PrimaryButton size="md" onClick={() => setStep("select")}>
                  Continue — Select Skill
                </PrimaryButton>
              </div>
            </>
          )}

          {step === "select" && (
            <>
              <div>
                <label className="block text-[12.5px] font-medium text-text-dim mb-2">
                  Select a skill topic
                </label>
                <select
                  value={skillTopic}
                  onChange={(e) => {
                    setSkillTopic(e.target.value);
                    setError(null);
                  }}
                  className="w-full h-10 rounded-md border border-border-default bg-surface-2 px-3 text-[13px] text-text focus:border-brand focus:outline-none"
                >
                  <option value="">— Choose a skill —</option>
                  {SKILLS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                  <option value="__custom">✏️ Type custom topic…</option>
                </select>
              </div>

              {skillTopic === "__custom" && (
                <div>
                  <label className="block text-[12.5px] font-medium text-text-dim mb-2">
                    Enter your skill topic
                  </label>
                  <input
                    type="text"
                    value={customTopic}
                    onChange={(e) => {
                      setCustomTopic(e.target.value);
                      setError(null);
                    }}
                    placeholder="e.g. Svelte, Cybersecurity, Data Engineering"
                    className="w-full h-10 rounded-md border border-border-default bg-surface-2 px-3 text-[13px] text-text placeholder:text-text-subtle focus:border-brand focus:outline-none"
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {step === "select" && (
          <div className="flex items-center justify-between border-t border-border-subtle px-5 py-3">
            <GhostButton size="md" onClick={() => setStep("info")} disabled={loading}>
              Back
            </GhostButton>
            <PrimaryButton
              size="md"
              onClick={handleStart}
              disabled={loading || !selectedTopic}
              icon={<Sparkles size={14} />}
            >
              {loading ? "Generating Test…" : "Start Test"}
            </PrimaryButton>
          </div>
        )}
      </div>
    </div>
  );
}
