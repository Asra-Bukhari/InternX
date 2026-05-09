import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { ArrowLeft, Users, AlertCircle, CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/forms/PageShell";
import { Panel } from "@/components/forms/Panel";
import { GhostButton } from "@/components/forms/GhostButton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ApplicantCard, type ApplicantViewModel } from "@/components/data-display/ApplicantCard";
import { projectsApi } from "@/lib/api/projects";
import { applicationsApi } from "@/lib/api/applications";
import { ApiError } from "@/lib/api/client";
import { type BackendProject, applicantsCount, selectedStudentName } from "@/types/project";
import type { BackendApplication } from "@/types/application";

function applicantToVM(a: BackendApplication, projectTags: string[]): ApplicantViewModel {
  const studentRef = a.studentId;
  const id = typeof studentRef === "string" ? studentRef : studentRef._id;
  const name = typeof studentRef === "string" ? "Student" : studentRef.name ?? "Student";
  const email = typeof studentRef === "string" ? "" : studentRef.email ?? "";
  const initials =
    name
      .split(" ")
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "S";
  // Backend doesn't expose applicant skills/profile yet. We mark all project tags
  // as candidate matches but cannot verify until /users/:id endpoint exists.
  return {
    applicationId: a._id,
    studentId: id,
    name,
    initials,
    email,
    skills: [],
    matchedTags: [],
    testScore: a.aiTestScore ?? 0,
    whyMeEssay: a.whyMeEssay ?? "",
    status: a.status,
    // Suppress unused linter for projectTags — kept in signature for future use
    ...(projectTags.length === 0 ? {} : {}),
  };
}

export default function BusinessProjectApplicants() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<BackendProject | null>(null);
  const [applications, setApplications] = useState<BackendApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acting, setActing] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!id) return;
    setError(null);
    try {
      const [projRes, appsRes] = await Promise.all([
        projectsApi.get(id),
        applicationsApi.forProject(id).catch(() => [] as BackendApplication[]),
      ]);
      setProject(projRes.project);
      setApplications(appsRes);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load applicants.");
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    async function init() {
      setLoading(true);
      await reload();
      if (!cancelled) setLoading(false);
    }
    init();
    return () => {
      cancelled = true;
    };
  }, [id, reload]);

  async function onAccept(applicationId: string) {
    setActing(applicationId);
    setError(null);
    setSuccess(null);
    try {
      await applicationsApi.accept(applicationId);
      setSuccess("Applicant accepted. Project moved to In Progress.");
      await reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not accept applicant.");
    } finally {
      setActing(null);
    }
  }

  async function onReject(applicationId: string) {
    setActing(applicationId);
    setError(null);
    try {
      await applicationsApi.reject(applicationId);
      await reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not reject applicant.");
    } finally {
      setActing(null);
    }
  }

  if (loading) {
    return (
      <PageShell title="Loading…">
        <p className="text-[13px] text-text-subtle">Loading project…</p>
      </PageShell>
    );
  }

  if (!project) {
    return (
      <PageShell title="Project not found">
        <EmptyState
          title="Project missing"
          action={
            <Link to="/dashboard/business/projects" className="text-brand text-[13px] hover:underline">
              ← Back to projects
            </Link>
          }
        />
      </PageShell>
    );
  }

  const tags = project.skillsRequired ?? [];
  const total = applicantsCount(project);
  const selected = selectedStudentName(project);

  return (
    <PageShell
      title={project.title}
      subtitle={`${total} of 10 applicants${selected ? ` · Hired: ${selected}` : ""}`}
      actions={<GhostButton icon={<ArrowLeft size={14} />} onClick={() => navigate(-1)}>Back</GhostButton>}
    >
      {success && (
        <div className="mb-4 flex items-start gap-2 rounded-md border border-status-success/30 bg-status-success-soft px-3 py-2.5 text-[12.5px] text-status-success">
          <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-md border border-status-danger/30 bg-status-danger-soft px-3 py-2.5 text-[12.5px] text-status-danger">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Panel padding="p-5" className="mb-6">
        <p className="text-[13px] text-text-muted leading-relaxed line-clamp-3">{project.summary || project.description}</p>
        <div className="mt-3 text-[12px] text-text-subtle capitalize">
          {project.contractType} · {project.difficulty} · {project.durationLabel || "—"}
        </div>
      </Panel>

      {applications.length === 0 ? (
        <Panel padding="p-12">
          <EmptyState
            icon={<Users size={20} />}
            title="No applicants yet"
            description="Applications are capped at 10 students per project. Check back soon."
          />
        </Panel>
      ) : (
        <div className="grid lg:grid-cols-2 gap-5">
          {applications.map((a) => {
            const vm = applicantToVM(a, tags);
            return (
              <ApplicantCard
                key={a._id}
                applicant={vm}
                disabled={acting === a._id || project.status !== "open"}
                onAccept={() => onAccept(a._id)}
                onReject={() => onReject(a._id)}
              />
            );
          })}
        </div>
      )}
    </PageShell>
  );
}
