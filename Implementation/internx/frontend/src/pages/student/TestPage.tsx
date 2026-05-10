import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router";
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertTriangle,
  ShieldAlert,
  Code2,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { PageShell } from "@/components/forms/PageShell";
import { Panel } from "@/components/forms/Panel";
import { PrimaryButton } from "@/components/forms/PrimaryButton";
import { GhostButton } from "@/components/forms/GhostButton";
import {
  aiApi,
  analyzeFrame,
  type TestQuestion,
  type EvaluateTestResponse,
} from "@/lib/api/ai";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils/cn";

/* ────────────────────────────── State passed via route ────────────── */
interface TestRouteState {
  testId: string;
  questions: TestQuestion[];
  testType: "skill_badge" | "project_application";
  skillTopic?: string;
  projectId?: string;
  projectTitle?: string;
}

/* ────────────────────────────── Cheat reasons mapping ─────────────── */
const CHEAT_LABELS: Record<string, string> = {
  no_face: "No face detected in webcam",
  multiple_faces: "Multiple faces detected",
  looking_away: "You were looking away from the screen",
};

export default function TestPage() {
  const { testId: paramTestId } = useParams<{ testId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as TestRouteState | undefined;

  /* Redirect back if no state */
  useEffect(() => {
    if (!state?.questions || !state?.testId) {
      navigate("/dashboard/student/profile", { replace: true });
    }
  }, [state, navigate]);

  if (!state?.questions || !state?.testId) return null;

  return (
    <TestPageInner
      testId={state.testId}
      questions={state.questions}
      testType={state.testType}
      skillTopic={state.skillTopic}
      projectId={state.projectId}
      projectTitle={state.projectTitle}
    />
  );
}

/* ────────────────────────────── Main Test Component ───────────────── */
function TestPageInner({
  testId,
  questions,
  testType,
  skillTopic,
  projectId,
  projectTitle,
}: {
  testId: string;
  questions: TestQuestion[];
  testType: "skill_badge" | "project_application";
  skillTopic?: string;
  projectId?: string;
  projectTitle?: string;
}) {
  const navigate = useNavigate();
  const totalQuestions = questions.length;

  /* Current question index */
  const [currentQ, setCurrentQ] = useState(0);
  /* Student answers */
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (let i = 0; i < totalQuestions; i++) initial[String(i)] = "";
    return initial;
  });

  /* Webcam state */
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  /* Proctoring state — use ref for consecutive counter to avoid re-renders */
  const cheatCounterRef = useRef(0);
  const [cheatingDetected, setCheatingDetected] = useState(false);
  const [cheatReason, setCheatReason] = useState("");
  const [cheatWarningVisible, setCheatWarningVisible] = useState(false);

  /* Submission state */
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<EvaluateTestResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  /* Elapsed time */
  const startTimeRef = useRef(Date.now());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsed(Date.now() - startTimeRef.current), 1000);
    return () => clearInterval(timer);
  }, []);

  /* ── Init webcam ────────────────────────────────────────────────── */
  useEffect(() => {
    let mounted = true;
    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240 },
        });
        if (!mounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        setCameraReady(true);
      } catch {
        if (mounted) setCameraError("Camera access denied. Webcam proctoring is required for this test.");
      }
    }
    initCamera();
    return () => {
      mounted = false;
      stopCamera();
    };
  }, []);

  function stopCamera() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }

  /* ── Proctoring interval — every 4 seconds ──────────────────────── */
  useEffect(() => {
    if (!cameraReady || cheatingDetected) return;

    intervalRef.current = setInterval(async () => {
      if (!videoRef.current || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 240;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const frameBase64 = canvas.toDataURL("image/jpeg", 0.7);

      try {
        const result = await analyzeFrame(frameBase64);
        if (result.cheating) {
          cheatCounterRef.current += 1;
          setCheatWarningVisible(true);

          if (cheatCounterRef.current >= 3) {
            /* Flag cheating on backend */
            try {
              await aiApi.flagCheating(
                testId,
                result.reason || "unknown",
                result.message || "Cheating detected during proctored test."
              );
            } catch {
              /* best-effort */
            }
            setCheatingDetected(true);
            setCheatReason(
              CHEAT_LABELS[result.reason || ""] || result.message || "Suspicious activity detected."
            );
            stopCamera();
          }
        } else {
          /* Clean frame — reset counter */
          cheatCounterRef.current = 0;
          setCheatWarningVisible(false);
        }
      } catch {
        /* Network error with proctoring — ignore silently */
      }
    }, 4000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [cameraReady, cheatingDetected, testId]);

  /* ── Answer management ──────────────────────────────────────────── */
  const setAnswer = useCallback(
    (index: number, value: string) => {
      setAnswers((prev) => ({ ...prev, [String(index)]: value }));
    },
    []
  );

  /* ── Submit test ────────────────────────────────────────────────── */
  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    stopCamera();

    try {
      const res = await aiApi.evaluateTest(testId, answers);
      setResults(res);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not submit test.");
    } finally {
      setSubmitting(false);
    }
  }

  /* ── Format elapsed ──────────────────────────────────────────────── */
  const mins = Math.floor(elapsed / 60000);
  const secs = Math.floor((elapsed % 60000) / 1000);
  const elapsedStr = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

  /* ── Title string ────────────────────────────────────────────────── */
  const topicLabel =
    testType === "skill_badge"
      ? `Skill Badge Test — ${skillTopic || "Skill"}`
      : `Project Test — ${projectTitle || "Project"}`;

  /* ═══════════════════════════════════════════════════════════════════
     CHEATING DETECTED — Full screen overlay
     ═══════════════════════════════════════════════════════════════════ */
  if (cheatingDetected) {
    return (
      <div className="fixed inset-0 z-[100] grid place-items-center bg-black/90 p-6">
        <div className="w-full max-w-lg text-center space-y-6">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-status-danger/20">
            <ShieldAlert size={40} className="text-status-danger" />
          </div>
          <h1 className="text-[28px] font-bold text-status-danger">Test Terminated</h1>
          <p className="text-[16px] text-text-dim leading-relaxed">
            Cheating detected: <span className="font-semibold text-white">{cheatReason}</span>
          </p>
          <p className="text-[14px] text-text-muted">
            You are banned from retaking this test. Your session has been flagged.
          </p>
          <PrimaryButton
            size="lg"
            onClick={() => navigate("/dashboard/student/profile", { replace: true })}
          >
            Return to Profile
          </PrimaryButton>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════════════
     RESULTS PAGE
     ═══════════════════════════════════════════════════════════════════ */
  if (results) {
    return (
      <TestResults
        results={results}
        testType={testType}
        topicLabel={topicLabel}
        projectId={projectId}
        questions={questions}
      />
    );
  }

  /* ═══════════════════════════════════════════════════════════════════
     CAMERA ERROR
     ═══════════════════════════════════════════════════════════════════ */
  if (cameraError) {
    return (
      <PageShell title="Camera Required">
        <Panel padding="p-8" className="max-w-lg mx-auto text-center space-y-4">
          <Camera size={40} className="mx-auto text-status-danger" />
          <p className="text-[14px] text-text-dim">{cameraError}</p>
          <GhostButton onClick={() => navigate(-1)}>Go Back</GhostButton>
        </Panel>
      </PageShell>
    );
  }

  /* ═══════════════════════════════════════════════════════════════════
     TEST UI
     ═══════════════════════════════════════════════════════════════════ */
  const q = questions[currentQ];
  const isLast = currentQ === totalQuestions - 1;
  const answeredCount = Object.values(answers).filter((a) => a.trim().length > 0).length;

  return (
    <div className="min-h-screen bg-bg text-foreground">
      {/* ── Top bar ──────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 border-b border-border-default bg-surface-1/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <h1 className="text-[15px] font-semibold text-text truncate max-w-[260px]">{topicLabel}</h1>
            <span className="hidden sm:inline text-[12px] text-text-subtle rounded-md bg-surface-3 px-2 py-1">
              Question {currentQ + 1} of {totalQuestions}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[13px] text-text-muted font-mono">{elapsedStr}</span>
            <span className="text-[11.5px] text-text-subtle">
              {answeredCount}/{totalQuestions} answered
            </span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-0.5 bg-surface-3">
          <div
            className="h-full bg-brand transition-all duration-300"
            style={{ width: `${((currentQ + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* ── Cheat warning banner ─────────────────────────────────────── */}
      {cheatWarningVisible && (
        <div className="mx-auto max-w-5xl px-4 mt-3">
          <div className="flex items-center gap-2 rounded-md border border-status-warning/40 bg-status-warning-soft px-3 py-2 text-[12.5px] text-status-warning animate-in fade-in">
            <AlertTriangle size={14} />
            <span>
              Warning: Suspicious activity detected ({cheatCounterRef.current}/3). Please face the camera.
            </span>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-5xl px-4 py-6 grid lg:grid-cols-[1fr_260px] gap-6">
        {/* ── Question area ──────────────────────────────────────────── */}
        <div className="space-y-6">
          <Panel padding="p-6" className="space-y-5">
            {/* Question type tag */}
            <div className="flex items-center gap-2">
              {q.type === "mcq" && (
                <span className="inline-flex items-center gap-1 rounded-md bg-status-info-soft px-2 py-0.5 text-[11px] font-medium text-status-info">
                  <CheckCircle2 size={11} /> Multiple Choice
                </span>
              )}
              {q.type === "short_answer" && (
                <span className="inline-flex items-center gap-1 rounded-md bg-status-success-soft px-2 py-0.5 text-[11px] font-medium text-status-success">
                  <FileText size={11} /> Short Answer
                </span>
              )}
              {q.type === "coding" && (
                <span className="inline-flex items-center gap-1 rounded-md bg-brand/15 px-2 py-0.5 text-[11px] font-medium text-brand">
                  <Code2 size={11} /> Coding
                </span>
              )}
              <span className="text-[11px] text-text-subtle ml-auto">Q{currentQ + 1}</span>
            </div>

            {/* Question text */}
            <p className="text-[15px] text-text leading-relaxed whitespace-pre-wrap">{q.questionText}</p>

            {/* Answer input */}
            {q.type === "mcq" && q.options && (
              <div className="space-y-2">
                {q.options.map((opt, i) => {
                  const selected = answers[String(currentQ)] === opt;
                  return (
                    <label
                      key={i}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-all",
                        selected
                          ? "border-brand bg-brand/10 text-text"
                          : "border-border-default bg-surface-2 text-text-dim hover:border-border-strong"
                      )}
                    >
                      <div
                        className={cn(
                          "grid h-5 w-5 flex-shrink-0 place-items-center rounded-full border-2 transition-colors",
                          selected ? "border-brand bg-brand" : "border-border-strong"
                        )}
                      >
                        {selected && <div className="h-2 w-2 rounded-full bg-white" />}
                      </div>
                      <span className="text-[13.5px]">{opt}</span>
                      <input
                        type="radio"
                        name={`q-${currentQ}`}
                        value={opt}
                        checked={selected}
                        onChange={() => setAnswer(currentQ, opt)}
                        className="sr-only"
                      />
                    </label>
                  );
                })}
              </div>
            )}

            {q.type === "short_answer" && (
              <textarea
                rows={4}
                value={answers[String(currentQ)]}
                onChange={(e) => setAnswer(currentQ, e.target.value)}
                placeholder="Type your answer here…"
                className="w-full rounded-lg border border-border-default bg-surface-2 px-4 py-3 text-[13.5px] text-text placeholder:text-text-subtle focus:border-brand focus:outline-none resize-none"
              />
            )}

            {q.type === "coding" && (
              <textarea
                rows={10}
                value={answers[String(currentQ)]}
                onChange={(e) => setAnswer(currentQ, e.target.value)}
                placeholder="Write your code here…"
                className="w-full rounded-lg border border-border-default bg-[#0D0D0D] px-4 py-3 text-[13px] text-text placeholder:text-text-subtle font-mono focus:border-brand focus:outline-none resize-none"
                spellCheck={false}
              />
            )}
          </Panel>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <GhostButton
              size="md"
              icon={<ChevronLeft size={14} />}
              onClick={() => setCurrentQ((p) => Math.max(0, p - 1))}
              disabled={currentQ === 0}
            >
              Previous
            </GhostButton>

            <div className="flex items-center gap-2">
              {/* Question dots */}
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentQ(i)}
                  className={cn(
                    "h-2.5 w-2.5 rounded-full transition-all",
                    i === currentQ
                      ? "bg-brand scale-125"
                      : answers[String(i)]?.trim()
                      ? "bg-status-success"
                      : "bg-surface-3 hover:bg-border-strong"
                  )}
                />
              ))}
            </div>

            {isLast ? (
              <PrimaryButton
                size="md"
                icon={<Send size={14} />}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Submitting…" : "Submit Test"}
              </PrimaryButton>
            ) : (
              <PrimaryButton
                size="md"
                icon={<ChevronRight size={14} />}
                onClick={() => setCurrentQ((p) => Math.min(totalQuestions - 1, p + 1))}
              >
                Next
              </PrimaryButton>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-md border border-status-danger/30 bg-status-danger-soft px-3 py-2.5 text-[12.5px] text-status-danger">
              <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* ── Sidebar: Webcam + question list ─────────────────────────── */}
        <aside className="space-y-4">
          {/* Webcam feed */}
          <Panel padding="p-3" className="relative overflow-hidden">
            <p className="text-[11px] uppercase tracking-wider text-text-subtle mb-2 flex items-center gap-1.5">
              <Camera size={11} />
              Webcam Proctoring
              {cameraReady && (
                <span className="ml-auto flex items-center gap-1 text-status-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-status-success animate-pulse" />
                  Live
                </span>
              )}
            </p>
            <div className="rounded-md overflow-hidden bg-black aspect-video">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            </div>
          </Panel>

          {/* Question overview */}
          <Panel padding="p-3">
            <p className="text-[11px] uppercase tracking-wider text-text-subtle mb-2">Questions</p>
            <div className="grid grid-cols-5 gap-1.5">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentQ(i)}
                  className={cn(
                    "h-8 rounded-md text-[12px] font-medium transition-all",
                    i === currentQ
                      ? "bg-brand text-white"
                      : answers[String(i)]?.trim()
                      ? "bg-status-success/20 text-status-success border border-status-success/30"
                      : "bg-surface-3 text-text-subtle hover:bg-border-default"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </Panel>
        </aside>
      </div>

      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   TEST RESULTS COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */
function TestResults({
  results,
  testType,
  topicLabel,
  projectId,
  questions,
}: {
  results: EvaluateTestResponse;
  testType: "skill_badge" | "project_application";
  topicLabel: string;
  projectId?: string;
  questions: TestQuestion[];
}) {
  const navigate = useNavigate();
  const canvasConfettiRef = useRef(false);
  const [applyingProject, setApplyingProject] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);

  /* Confetti for badge awarded */
  useEffect(() => {
    if (results.badgeAwarded && !canvasConfettiRef.current) {
      canvasConfettiRef.current = true;
      import("canvas-confetti").then((mod) => {
        const fire = mod.default;
        fire({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        setTimeout(() => fire({ particleCount: 80, spread: 120, origin: { y: 0.7 } }), 300);
      });
    }
  }, [results.badgeAwarded]);

  /* Auto-apply for project tests */
  useEffect(() => {
    if (testType === "project_application" && results.passed && projectId && !applied && !applyingProject) {
      setApplyingProject(true);
      import("@/lib/api/applications").then(async ({ applicationsApi }) => {
        try {
          await applicationsApi.apply({
            projectId,
            aiTestScore: results.score,
          });
          setApplied(true);
        } catch (err) {
          setApplyError(
            err instanceof ApiError ? err.message : "Could not submit project application."
          );
        } finally {
          setApplyingProject(false);
        }
      });
    }
  }, [testType, results.passed, projectId, applied, applyingProject, results.score]);

  return (
    <PageShell title="Test Results" subtitle={topicLabel}>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Score card */}
        <Panel padding="p-8" className="text-center space-y-4">
          <div
            className={cn(
              "mx-auto grid h-24 w-24 place-items-center rounded-full text-[32px] font-bold",
              results.passed
                ? "bg-status-success/15 text-status-success"
                : "bg-status-danger/15 text-status-danger"
            )}
          >
            {results.score}
          </div>
          <h2 className="text-[22px] font-bold text-text">
            {results.passed ? "Congratulations! You Passed ✅" : "Test Not Passed ❌"}
          </h2>
          <p className="text-[14px] text-text-muted">{results.overallFeedback}</p>

          {results.badgeAwarded && (
            <div className="inline-flex items-center gap-2 rounded-lg bg-brand/10 border border-brand/30 px-5 py-3 text-[15px] font-semibold text-brand">
              🎉 You earned the <span className="text-white">{results.badgeAwarded}</span> badge!
            </div>
          )}

          {testType === "project_application" && results.passed && (
            <div className="text-[13px] text-status-success">
              {applyingProject
                ? "Submitting your project application…"
                : applied
                ? "✅ Your project application has been submitted automatically!"
                : applyError
                ? applyError
                : ""}
            </div>
          )}

          {testType === "project_application" && !results.passed && (
            <p className="text-[13px] text-status-warning">
              You did not pass the skill test. You cannot apply for this project at this time.
            </p>
          )}

          {testType === "skill_badge" && !results.passed && (
            <p className="text-[13px] text-text-muted">
              You did not pass. You may retake this test.
            </p>
          )}
        </Panel>

        {/* Per-question breakdown */}
        <Panel padding="p-6">
          <h3 className="text-[15px] font-semibold text-text mb-4">Question Breakdown</h3>
          <div className="space-y-3">
            {results.perQuestion.map((pq) => (
              <div
                key={pq.questionIndex}
                className="rounded-md border border-border-subtle bg-surface-2 p-4"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="text-[13px] text-text-dim line-clamp-2">
                    <span className="font-medium text-text">Q{pq.questionIndex + 1}:</span>{" "}
                    {questions[pq.questionIndex]?.questionText || ""}
                  </p>
                  <span
                    className={cn(
                      "flex-shrink-0 rounded-md px-2 py-0.5 text-[12px] font-semibold",
                      pq.marks >= pq.maxMarks * 0.7
                        ? "bg-status-success/15 text-status-success"
                        : pq.marks >= pq.maxMarks * 0.4
                        ? "bg-status-warning/15 text-status-warning"
                        : "bg-status-danger/15 text-status-danger"
                    )}
                  >
                    {pq.marks}/{pq.maxMarks}
                  </span>
                </div>
                <p className="text-[12.5px] text-text-subtle leading-relaxed">{pq.comment}</p>
              </div>
            ))}
          </div>
        </Panel>

        {/* Navigation */}
        <div className="flex justify-center gap-3">
          <GhostButton
            size="md"
            onClick={() =>
              navigate(
                testType === "skill_badge"
                  ? "/dashboard/student/profile"
                  : "/dashboard/student/projects",
                { replace: true }
              )
            }
          >
            {testType === "skill_badge" ? "Back to Profile" : "Back to Projects"}
          </GhostButton>
        </div>
      </div>
    </PageShell>
  );
}
