import { useEffect, useState } from "react";
import { Link } from "react-router";
import { FolderOpen, AlertCircle, ArrowRight, Briefcase, Hourglass, Calendar } from "lucide-react";
import { PageShell } from "@/components/forms/PageShell";
import { Panel } from "@/components/forms/Panel";
import { ProgressBar } from "@/components/data-display/ProgressBar";
import { StatusTag } from "@/components/data-display/StatusTag";
import { DifficultyTag } from "@/components/data-display/DifficultyTag";
import { GhostButton } from "@/components/forms/GhostButton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { applicationsApi } from "@/lib/api/applications";
import { projectsApi } from "@/lib/api/projects";
import { ApiError } from "@/lib/api/client";
import {
  type BackendProject,
  uiStatusLabel,
  uiProgress,
  CONTRACT_LABEL,
} from "@/types/project";

export default function StudentActiveProject() {
  const [project, setProject] = useState<BackendProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const apps = await applicationsApi.myApplications();
        const accepted = apps.find((a) => a.status === "accepted");
        if (!accepted) {
          if (!cancelled) setProject(null);
          return;
        }
        const pid = typeof accepted.projectId === "string" ? accepted.projectId : accepted.projectId._id;
        const res = await projectsApi.get(pid);
        if (cancelled) return;
        setProject(res.project);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Could not load active project.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <PageShell title="Active Project">
        <p className="text-[13px] text-text-subtle">Loading…</p>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell title="Active Project">
        <div className="flex items-start gap-2 rounded-md border border-status-danger/30 bg-status-danger-soft px-3 py-2.5 text-[12.5px] text-status-danger">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      </PageShell>
    );
  }

  if (!project) {
    return (
      <PageShell title="Active Project" subtitle="Your current project workspace">
        <Panel padding="p-12">
          <EmptyState
            icon={<FolderOpen size={20} />}
            title="No active project"
            description="You'll see your project workspace here once a business hires you."
            action={
              <Link to="/dashboard/student/projects" className="text-brand text-[13px] hover:underline">
                Browse open projects →
              </Link>
            }
          />
        </Panel>
      </PageShell>
    );
  }

  const businessName =
    typeof project.businessId === "string" ? "Business" : project.businessId.name ?? "Business";

  return (
    <PageShell
      title={project.title}
      subtitle={businessName}
      actions={
        <GhostButton size="md" disabled icon={<ArrowRight size={14} />}>
          Open Workspace
        </GhostButton>
      }
    >
      <Panel padding="p-6" className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <DifficultyTag level={project.difficulty} />
            <StatusTag label={uiStatusLabel(project)} variant="in-progress" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="flex justify-between text-[11.5px] text-text-subtle mb-1.5">
              <span>Progress</span>
              <span>{uiProgress(project)}%</span>
            </div>
            <ProgressBar value={uiProgress(project)} />
          </div>
        </div>
      </Panel>

      <div className="grid lg:grid-cols-3 gap-6">
        <Panel padding="p-6" className="lg:col-span-2">
          <h2 className="text-[16px] font-semibold text-text">About</h2>
          <p className="mt-2 text-[13.5px] text-text-muted leading-relaxed whitespace-pre-line">
            {project.description}
          </p>
          {project.deliverables && project.deliverables.length > 0 && (
            <>
              <h3 className="mt-6 text-[14px] font-semibold text-text">Deliverables</h3>
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
        <Panel padding="p-5">
          <h3 className="text-[14px] font-semibold text-text mb-4">Project info</h3>
          <ul className="space-y-3 text-[13px]">
            <li className="flex justify-between"><span className="text-text-subtle inline-flex items-center gap-1.5"><Briefcase size={13}/>Budget</span><span className="text-text font-medium">{project.budget ? `$${project.budget.toLocaleString()}` : "—"}</span></li>
            <li className="flex justify-between"><span className="text-text-subtle inline-flex items-center gap-1.5"><Calendar size={13}/>Duration</span><span className="text-text font-medium">{project.durationLabel || "—"}</span></li>
            <li className="flex justify-between"><span className="text-text-subtle inline-flex items-center gap-1.5"><Hourglass size={13}/>Hours/day</span><span className="text-text font-medium">{project.hoursPerDay || "—"}</span></li>
            <li className="flex justify-between"><span className="text-text-subtle">Contract</span><span className="text-text font-medium">{CONTRACT_LABEL[project.contractType]}</span></li>
            <li className="flex justify-between"><span className="text-text-subtle">Status</span><span className="text-brand font-medium">{uiStatusLabel(project)}</span></li>
          </ul>
          <p className="mt-4 text-[11.5px] text-text-subtle">
            Full workspace (chat, deliverables, files) coming soon.
          </p>
        </Panel>
      </div>
    </PageShell>
  );
}
