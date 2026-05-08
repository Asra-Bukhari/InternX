import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { ArrowLeft, Briefcase, Clock, Users, Calendar, Lock, AlertCircle, CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/forms/PageShell";
import { Panel } from "@/components/forms/Panel";
import { DifficultyTag } from "@/components/data-display/DifficultyTag";
import { SkillChip } from "@/components/data-display/SkillChip";
import { PrimaryButton } from "@/components/forms/PrimaryButton";
import { GhostButton } from "@/components/forms/GhostButton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { OnboardingBanner } from "@/components/feedback/OnboardingBanner";
import { useAuth } from "@/lib/auth/useAuth";
import { projectsApi, adaptProject } from "@/lib/api/projects";
import { eligibilityApi, applicationsApi } from "@/lib/api/applications";
import { ApiError } from "@/lib/api/client";
import type { Project } from "@/types/project";

export default function StudentProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profileComplete } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applyMessage, setApplyMessage] = useState<string | null>(null);
  const [eligibilityReason, setEligibilityReason] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setNotFound(false);
      setError(null);
      try {
        const res = await projectsApi.get(id!);
        if (cancelled) return;
        setProject(adaptProject(res.project));
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
        } else {
          setError(err instanceof ApiError ? err.message : "Could not load project.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function onApply() {
    if (!id) return;
    if (!profileComplete) {
      navigate("/dashboard/student/profile/setup");
      return;
    }
    setApplying(true);
    setApplyMessage(null);
    setEligibilityReason(null);
    try {
      const elig = await eligibilityApi.check(id);
      if (!elig.eligible) {
        setEligibilityReason(elig.reason);
        return;
      }
      await applicationsApi.apply(id);
      setApplied(true);
      setApplyMessage("Application submitted.");
    } catch (err) {
      setApplyMessage(err instanceof ApiError ? err.message : "Could not submit application.");
    } finally {
      setApplying(false);
    }
  }

  if (loading) {
    return (
      <PageShell title="Loading project…">
        <p className="text-[13px] text-text-subtle">Loading…</p>
      </PageShell>
    );
  }

  if (notFound || !project) {
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
          {!profileComplete ? (
            <Link to="/dashboard/student/profile/setup">
              <PrimaryButton size="md" icon={<Lock size={13} />}>Complete profile to apply</PrimaryButton>
            </Link>
          ) : applied ? (
            <PrimaryButton size="md" disabled icon={<CheckCircle2 size={13} />}>Application Sent</PrimaryButton>
          ) : (
            <PrimaryButton size="md" onClick={onApply} disabled={applying}>
              {applying ? "Applying…" : "Apply Now"}
            </PrimaryButton>
          )}
        </>
      }
    >
      <OnboardingBanner />

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-md border border-status-danger/30 bg-status-danger-soft px-3 py-2.5 text-[12.5px] text-status-danger">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {eligibilityReason && (
        <div className="mb-4 flex items-start gap-2 rounded-md border border-status-warning/30 bg-status-warning-soft px-3 py-2.5 text-[12.5px] text-status-warning">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <span>{eligibilityReason}</span>
        </div>
      )}
      {applyMessage && !eligibilityReason && (
        <div className={`mb-4 flex items-start gap-2 rounded-md border px-3 py-2.5 text-[12.5px] ${applied ? "border-status-success/30 bg-status-success-soft text-status-success" : "border-status-danger/30 bg-status-danger-soft text-status-danger"}`}>
          {applied ? <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" /> : <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />}
          <span>{applyMessage}</span>
        </div>
      )}

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

            {project.skills.length > 0 && (
              <>
                <h3 className="mt-6 text-[15px] font-semibold text-text">Required skills</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {project.skills.map((s) => <SkillChip key={s} label={s} />)}
                </div>
              </>
            )}
          </Panel>
        </div>

        <aside className="space-y-4">
          <Panel padding="p-5">
            <h3 className="text-[14px] font-semibold text-text mb-4">Project details</h3>
            <ul className="space-y-3 text-[13px]">
              <li className="flex items-start justify-between gap-2"><span className="text-text-subtle inline-flex items-center gap-1.5"><Briefcase size={13}/>Contract</span><span className="text-text font-medium">{project.contract}</span></li>
              <li className="flex items-start justify-between gap-2"><span className="text-text-subtle inline-flex items-center gap-1.5"><Calendar size={13}/>Difficulty</span><span className="text-text font-medium">{project.difficulty}</span></li>
              <li className="flex items-start justify-between gap-2"><span className="text-text-subtle inline-flex items-center gap-1.5"><Users size={13}/>Applicants</span><span className="text-text font-medium">{project.applicants} / 10</span></li>
              <li className="flex items-start justify-between gap-2"><span className="text-text-subtle inline-flex items-center gap-1.5"><Clock size={13}/>Posted</span><span className="text-text font-medium">{project.posted}</span></li>
            </ul>
          </Panel>
          {!profileComplete ? (
            <Link to="/dashboard/student/profile/setup">
              <PrimaryButton size="lg" className="w-full" icon={<Lock size={14} />}>
                Complete profile to apply
              </PrimaryButton>
            </Link>
          ) : applied ? (
            <PrimaryButton size="lg" className="w-full" disabled icon={<CheckCircle2 size={14} />}>
              Application Sent
            </PrimaryButton>
          ) : (
            <PrimaryButton size="lg" className="w-full" onClick={onApply} disabled={applying}>
              {applying ? "Applying…" : "Apply Now"}
            </PrimaryButton>
          )}
        </aside>
      </div>
    </PageShell>
  );
}
