import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  ArrowLeft,
  Briefcase,
  Clock,
  Users,
  Calendar,
  Lock,
  AlertCircle,
  CheckCircle2,
  Hourglass,
  Building2,
} from "lucide-react";
import { PageShell } from "@/components/forms/PageShell";
import { Panel } from "@/components/forms/Panel";
import { DifficultyTag } from "@/components/data-display/DifficultyTag";
import { SkillChip } from "@/components/data-display/SkillChip";
import { PrimaryButton } from "@/components/forms/PrimaryButton";
import { GhostButton } from "@/components/forms/GhostButton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { OnboardingBanner } from "@/components/feedback/OnboardingBanner";
import { ProjectTestModal } from "@/components/domain/ProjectTestModal";
import { useAuth } from "@/lib/auth/useAuth";
import { projectsApi } from "@/lib/api/projects";
import { applicationsApi, skillMatchOk } from "@/lib/api/applications";
import { ApiError } from "@/lib/api/client";
import {
  type BackendProject,
  applicantsCount,
  remainingSlots,
  projectOwnerName,
  projectOwnerInitials,
  CONTRACT_LABEL,
} from "@/types/project";

export default function StudentProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profileComplete, profile } = useAuth();

  const [project, setProject] = useState<BackendProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pendingCount, setPendingCount] = useState<number>(0);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setNotFound(false);
      setError(null);
      try {
        const [proj, myApps] = await Promise.all([
          projectsApi.get(id!),
          applicationsApi.myApplications().catch(() => []),
        ]);
        if (cancelled) return;
        setProject(proj.project);
        const pending = myApps.filter((a) => a.status === "pending");
        setPendingCount(pending.length);
        const exists = myApps.some(
          (a) => (typeof a.projectId === "string" ? a.projectId : a.projectId._id) === id,
        );
        setAlreadyApplied(exists);
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

  const skillMatch = useMemo(() => {
    if (!project) return null;
    return skillMatchOk(project.skillsRequired ?? [], profile?.skills ?? []);
  }, [project, profile]);

  const eligibility = useMemo(() => {
    if (!project) return { ok: false, reason: "Loading…" };
    if (!profileComplete) return { ok: false, reason: "Complete your profile to apply." };
    if (alreadyApplied || applied) return { ok: false, reason: "You've already applied to this project." };
    if (project.selectedStudent) return { ok: false, reason: "This project has already been assigned." };
    if (applicantsCount(project) >= 10) return { ok: false, reason: "This project's 10 applicant slots are full." };
    if (pendingCount >= 3) return { ok: false, reason: "You've reached the 3 active applications limit." };
    if (skillMatch && !skillMatch.ok) {
      return {
        ok: false,
        reason: `You need to match at least ${skillMatch.required} of this project's tags. You match ${skillMatch.matched.length}.`,
      };
    }
    return { ok: true, reason: "" };
  }, [project, profileComplete, alreadyApplied, applied, pendingCount, skillMatch]);

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

  const slots = remainingSlots(project);
  const totalApplicants = applicantsCount(project);
  const skills = project.skillsRequired ?? [];

  function ApplyButton({ size = "md" }: { size?: "md" | "lg" }) {
    if (!profileComplete) {
      return (
        <Link to="/dashboard/student/profile/setup">
          <PrimaryButton size={size} icon={<Lock size={size === "lg" ? 14 : 13} />}>
            Complete profile to apply
          </PrimaryButton>
        </Link>
      );
    }
    if (applied || alreadyApplied) {
      return (
        <PrimaryButton size={size} disabled icon={<CheckCircle2 size={size === "lg" ? 14 : 13} />}>
          Application Sent
        </PrimaryButton>
      );
    }
    return (
      <PrimaryButton size={size} onClick={() => setModalOpen(true)} disabled={!eligibility.ok}>
        Apply Now
      </PrimaryButton>
    );
  }

  return (
    <PageShell
      title={project.title}
      subtitle={projectOwnerName(project)}
      actions={
        <>
          <GhostButton size="md" icon={<ArrowLeft size={14} />} onClick={() => navigate(-1)}>
            Back
          </GhostButton>
          <ApplyButton />
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
      {(applied || alreadyApplied) && (
        <div className="mb-4 flex items-start gap-2 rounded-md border border-status-success/30 bg-status-success-soft px-3 py-2.5 text-[12.5px] text-status-success">
          <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" />
          <span>Your application has been submitted. Track it in My Applications.</span>
        </div>
      )}
      {!eligibility.ok && eligibility.reason && profileComplete && !alreadyApplied && !applied && (
        <div className="mb-4 flex items-start gap-2 rounded-md border border-status-warning/30 bg-status-warning-soft px-3 py-2.5 text-[12.5px] text-status-warning">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <span>{eligibility.reason}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Panel padding="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="grid h-12 w-12 place-items-center rounded-md bg-surface-3 text-[14px] font-semibold text-text-dim">
                {projectOwnerInitials(project)}
              </div>
              <div>
                <p className="text-[12px] text-text-subtle">Posted by</p>
                <p className="text-[15px] font-semibold text-text">{projectOwnerName(project)}</p>
              </div>
              <div className="ml-auto"><DifficultyTag level={project.difficulty} /></div>
            </div>

            {project.summary && (
              <p className="text-[14px] text-text-dim leading-relaxed border-l-2 border-brand pl-4 mb-6">
                {project.summary}
              </p>
            )}

            <h2 className="text-[18px] font-semibold tracking-tight text-text">About this project</h2>
            <p className="mt-2 text-[14px] text-text-muted leading-relaxed whitespace-pre-line">
              {project.description}
            </p>

            {skills.length > 0 && (
              <>
                <h3 className="mt-6 text-[15px] font-semibold text-text">Required technologies</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {skills.map((s) => (
                    <SkillChip
                      key={s}
                      label={s}
                      active={skillMatch?.matched.includes(s) ?? false}
                    />
                  ))}
                </div>
                {skillMatch && (
                  <p className={`mt-2 text-[11.5px] ${skillMatch.ok ? "text-status-success" : "text-status-warning"}`}>
                    Skill match: {skillMatch.matched.length} of {skills.length} (need {skillMatch.required}+)
                  </p>
                )}
              </>
            )}

            {project.deliverables && project.deliverables.length > 0 && (
              <>
                <h3 className="mt-6 text-[15px] font-semibold text-text">Deliverables</h3>
                <ul className="mt-2 space-y-2">
                  {project.deliverables.map((d, i) => (
                    <li key={d._id ?? i} className="rounded-md border border-border-subtle bg-surface-2 px-3 py-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[13px] font-medium text-text">{d.title}</p>
                        {d.paymentPercent ? (
                          <span className="text-[11.5px] text-text-subtle">{d.paymentPercent}%</span>
                        ) : null}
                      </div>
                      {d.description && <p className="text-[12px] text-text-muted mt-0.5 leading-relaxed">{d.description}</p>}
                      {d.deadline && <p className="text-[11px] text-text-subtle mt-1">Due {d.deadline}</p>}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Panel>
        </div>

        <aside className="space-y-4">
          <Panel padding="p-5">
            <h3 className="text-[14px] font-semibold text-text mb-4">Project details</h3>
            <ul className="space-y-3 text-[13px]">
              <li className="flex items-start justify-between gap-2">
                <span className="text-text-subtle inline-flex items-center gap-1.5"><Briefcase size={13}/>Budget</span>
                <span className="text-text font-medium">{project.budget ? `$${project.budget.toLocaleString()}` : "—"}</span>
              </li>
              <li className="flex items-start justify-between gap-2">
                <span className="text-text-subtle inline-flex items-center gap-1.5"><Calendar size={13}/>Duration</span>
                <span className="text-text font-medium">{project.durationLabel || "—"}</span>
              </li>
              <li className="flex items-start justify-between gap-2">
                <span className="text-text-subtle inline-flex items-center gap-1.5"><Hourglass size={13}/>Hours/day</span>
                <span className="text-text font-medium">{project.hoursPerDay || "—"}</span>
              </li>
              <li className="flex items-start justify-between gap-2">
                <span className="text-text-subtle inline-flex items-center gap-1.5"><Clock size={13}/>Contract</span>
                <span className="text-text font-medium">{CONTRACT_LABEL[project.contractType]}</span>
              </li>
              <li className="flex items-start justify-between gap-2">
                <span className="text-text-subtle inline-flex items-center gap-1.5"><Building2 size={13}/>Category</span>
                <span className="text-text font-medium">{project.category || "—"}</span>
              </li>
              <li className="flex items-start justify-between gap-2">
                <span className="text-text-subtle inline-flex items-center gap-1.5"><Users size={13}/>Applicants</span>
                <span className="text-text font-medium">{totalApplicants} / 10 ({slots} left)</span>
              </li>
            </ul>
          </Panel>
          <ApplyButton size="lg" />
        </aside>
      </div>

      <ProjectTestModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        projectId={project._id}
        projectTitle={project.title}
        projectDescription={project.description}
        skillsRequired={skills}
      />
    </PageShell>
  );
}
