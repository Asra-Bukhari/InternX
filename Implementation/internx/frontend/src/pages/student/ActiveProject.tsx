import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router";
import {
  FolderOpen, AlertCircle, Briefcase, Hourglass, Calendar,
  LayoutDashboard, Package, MessageSquare, DollarSign,
} from "lucide-react";
import { PageShell } from "@/components/forms/PageShell";
import { Panel } from "@/components/forms/Panel";
import { ProgressBar } from "@/components/data-display/ProgressBar";
import { StatusTag } from "@/components/data-display/StatusTag";
import { DifficultyTag } from "@/components/data-display/DifficultyTag";
import { EmptyState } from "@/components/feedback/EmptyState";
import { DeliverableSubmissionForm } from "@/components/domain/DeliverableSubmissionForm";
import { StudentDeliverablesList } from "@/components/domain/StudentDeliverablesList";
import { WorkspaceChat } from "@/components/domain/WorkspaceChat";
import { WorkspacePayments } from "@/components/domain/WorkspacePayments";
import { applicationsApi } from "@/lib/api/applications";
import { projectsApi } from "@/lib/api/projects";
import { deliverablesApi, type BackendDeliverable } from "@/lib/api/payments";
import { ApiError } from "@/lib/api/client";
import {
  type BackendProject,
  uiStatusLabel,
  CONTRACT_LABEL,
} from "@/types/project";

type Tab = "overview" | "deliverables" | "chat" | "payments";

const TABS: { key: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "deliverables", label: "Deliverables", icon: Package },
  { key: "chat", label: "Chat", icon: MessageSquare },
  { key: "payments", label: "Payments", icon: DollarSign },
];

function computeProgress(project: BackendProject, submissions: BackendDeliverable[]): number {
  const total = project.deliverables?.length ?? 0;
  if (total === 0) {
    if (project.status === "completed") return 100;
    if (project.status === "in-progress") return 50;
    return 0;
  }
  const approved = submissions.filter((s) => s.status === "approved").length;
  return Math.round((approved / total) * 100);
}

export default function StudentActiveProject() {
  const [project, setProject] = useState<BackendProject | null>(null);
  const [submissions, setSubmissions] = useState<BackendDeliverable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const loadProject = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const apps = await applicationsApi.myApplications();
      const accepted = apps.find((a) => a.status === "accepted");
      if (!accepted) { setProject(null); return; }
      const pid = typeof accepted.projectId === "string" ? accepted.projectId : accepted.projectId._id;
      const [res, subs] = await Promise.all([
        projectsApi.get(pid),
        deliverablesApi.forProject(pid),
      ]);
      setProject(res.project);
      setSubmissions(subs);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load active project.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProject(); }, [loadProject]);

  const handleRefresh = useCallback(() => {
    if (!project) return;
    Promise.all([
      projectsApi.get(project._id),
      deliverablesApi.forProject(project._id),
    ]).then(([r, s]) => { setProject(r.project); setSubmissions(s); }).catch(() => {});
  }, [project]);

  if (loading) {
    return (
      <PageShell title="Active Project">
        <div className="flex items-center gap-3 py-20 justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <p className="text-[13px] text-text-subtle">Loading workspace…</p>
        </div>
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
  const progress = computeProgress(project, submissions);

  return (
    <PageShell title={project.title} subtitle={businessName}>
      {/* ── Progress header ── */}
      <Panel padding="p-5" className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <DifficultyTag level={project.difficulty} />
            <StatusTag label={uiStatusLabel(project)} variant={project.status === "completed" ? "completed" : "in-progress"} />
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="flex justify-between text-[11.5px] text-text-subtle mb-1.5">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <ProgressBar value={progress} />
          </div>
        </div>
      </Panel>

      {/* ── Tab bar ── */}
      <div className="flex items-center gap-1 border-b border-border-default mb-6 overflow-x-auto">
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium transition-colors border-b-2 whitespace-nowrap ${
                isActive
                  ? "border-brand text-brand"
                  : "border-transparent text-text-subtle hover:text-text hover:border-border-strong"
              }`}
            >
              <Icon size={15} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab content ── */}
      {activeTab === "overview" && (
        <OverviewTab project={project} submissions={submissions} progress={progress} />
      )}
      {activeTab === "deliverables" && (
        <DeliverablesTab project={project} submissions={submissions} onRefresh={handleRefresh} />
      )}
      {activeTab === "chat" && (
        <WorkspaceChat project={project} />
      )}
      {activeTab === "payments" && (
        <WorkspacePayments project={project} />
      )}
    </PageShell>
  );
}

/* ═══════════════════════════════════════════ Overview Tab ═══ */
function OverviewTab({ project, submissions, progress }: {
  project: BackendProject; submissions: BackendDeliverable[]; progress: number;
}) {
  const approvedCount = submissions.filter((s) => s.status === "approved").length;
  const pendingCount = submissions.filter((s) => s.status === "pending").length;
  const totalDel = project.deliverables?.length ?? 0;

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Panel padding="p-6">
          <h2 className="text-[16px] font-semibold text-text">About</h2>
          <p className="mt-2 text-[13.5px] text-text-muted leading-relaxed whitespace-pre-line">
            {project.description}
          </p>
        </Panel>

        {/* Quick stats */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Panel padding="p-4" className="text-center">
            <p className="text-[24px] font-bold text-brand">{progress}%</p>
            <p className="text-[12px] text-text-subtle mt-1">Overall Progress</p>
          </Panel>
          <Panel padding="p-4" className="text-center">
            <p className="text-[24px] font-bold text-status-success">{approvedCount}</p>
            <p className="text-[12px] text-text-subtle mt-1">Approved</p>
          </Panel>
          <Panel padding="p-4" className="text-center">
            <p className="text-[24px] font-bold text-status-warning">{pendingCount}</p>
            <p className="text-[12px] text-text-subtle mt-1">Pending Review</p>
          </Panel>
        </div>

        {/* Deliverable timeline */}
        {totalDel > 0 && (
          <Panel padding="p-6">
            <h3 className="text-[14px] font-semibold text-text mb-4">Deliverable Timeline</h3>
            <div className="space-y-3">
              {project.deliverables!.map((d, i) => {
                // Find submission at this deliverable position (submissions sorted newest-first from API)
                const sortedSubs = [...submissions].reverse();
                const subAtPos = sortedSubs[i];
                const isApproved = subAtPos?.status === "approved";
                const isCurrent = !isApproved && i === approvedCount;
                return (
                  <div key={d._id ?? i} className={`flex items-start gap-3 rounded-lg border px-4 py-3 ${
                    isApproved ? "border-status-success/30 bg-status-success-soft/30" :
                    isCurrent ? "border-brand/40 bg-brand/5" :
                    "border-border-subtle bg-surface-2"
                  }`}>
                    <div className={`mt-0.5 h-3 w-3 rounded-full flex-shrink-0 ${
                      isApproved ? "bg-status-success" : isCurrent ? "bg-brand" : "bg-border-strong"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[13px] font-medium text-text">{d.title}</p>
                        <span className={`text-[11px] font-medium ${
                          isApproved ? "text-status-success" : isCurrent ? "text-brand" : "text-text-subtle"
                        }`}>
                          {isApproved ? "Completed" : isCurrent ? "Current" : "Upcoming"}
                        </span>
                      </div>
                      {d.description && <p className="text-[12px] text-text-muted mt-0.5">{d.description}</p>}
                      <div className="flex items-center gap-3 mt-1">
                        {d.deadline && <span className="text-[11px] text-text-subtle">Due: {d.deadline}</span>}
                        {d.paymentPercent ? <span className="text-[11px] text-text-subtle">{d.paymentPercent}% payment</span> : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>
        )}
      </div>

      {/* Sidebar info */}
      <div className="space-y-4">
        <Panel padding="p-5">
          <h3 className="text-[14px] font-semibold text-text mb-4">Project Info</h3>
          <ul className="space-y-3 text-[13px]">
            <li className="flex justify-between"><span className="text-text-subtle inline-flex items-center gap-1.5"><Briefcase size={13}/>Budget</span><span className="text-text font-medium">{project.budget ? `$${project.budget.toLocaleString()}` : "—"}</span></li>
            <li className="flex justify-between"><span className="text-text-subtle inline-flex items-center gap-1.5"><Calendar size={13}/>Duration</span><span className="text-text font-medium">{project.durationLabel || "—"}</span></li>
            <li className="flex justify-between"><span className="text-text-subtle inline-flex items-center gap-1.5"><Hourglass size={13}/>Hours/day</span><span className="text-text font-medium">{project.hoursPerDay || "—"}</span></li>
            <li className="flex justify-between"><span className="text-text-subtle">Contract</span><span className="text-text font-medium">{CONTRACT_LABEL[project.contractType]}</span></li>
            <li className="flex justify-between"><span className="text-text-subtle">Status</span><span className="text-brand font-medium">{uiStatusLabel(project)}</span></li>
          </ul>
        </Panel>

        {project.skillsRequired && project.skillsRequired.length > 0 && (
          <Panel padding="p-5">
            <h3 className="text-[14px] font-semibold text-text mb-3">Required Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {project.skillsRequired.map((s) => (
                <span key={s} className="rounded-md bg-surface-3 px-2 py-0.5 text-[11.5px] text-text-muted">
                  {s}
                </span>
              ))}
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════ Deliverables Tab ═══ */
function DeliverablesTab({ project, submissions, onRefresh }: {
  project: BackendProject; submissions: BackendDeliverable[]; onRefresh: () => void;
}) {
  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3">
        <StudentDeliverablesList
          projectId={project._id}
          projectDeliverables={project.deliverables ?? []}
          submissions={submissions}
        />
      </div>
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-[14px] font-semibold text-text">Submit Work</h3>
        <DeliverableSubmissionForm projectId={project._id} onSubmitted={onRefresh} />
      </div>
    </div>
  );
}
