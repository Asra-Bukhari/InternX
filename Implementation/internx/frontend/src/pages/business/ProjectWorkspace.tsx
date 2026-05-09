import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { ArrowLeft, LayoutDashboard, ListChecks, MessageSquare, Video, FolderOpen, Package, AlertCircle } from "lucide-react";
import { PageShell } from "@/components/forms/PageShell";
import { GhostButton } from "@/components/forms/GhostButton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { OverviewTab } from "./workspace/OverviewTab";
import { TasksTab } from "./workspace/TasksTab";
import { ChatTab } from "./workspace/ChatTab";
import { MeetingsTab } from "./workspace/MeetingsTab";
import { FilesTab } from "./workspace/FilesTab";
import { DeliverablesTab } from "./workspace/DeliverablesTab";
import { projectsApi } from "@/lib/api/projects";
import { ApiError } from "@/lib/api/client";
import { type BackendProject, selectedStudentId, selectedStudentName } from "@/types/project";
import { cn } from "@/lib/utils/cn";

const TABS = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "tasks", label: "Tasks", icon: ListChecks },
  { key: "chat", label: "Chat", icon: MessageSquare },
  { key: "meetings", label: "Meetings", icon: Video },
  { key: "files", label: "Files", icon: FolderOpen },
  { key: "deliverables", label: "Deliverables", icon: Package },
] as const;

type TabKey = typeof TABS[number]["key"];

export default function BusinessProjectWorkspace() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>("overview");
  const [project, setProject] = useState<BackendProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await projectsApi.get(id!);
        if (cancelled) return;
        setProject(res.project);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Could not load project.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <PageShell title="Loading…">
        <p className="text-[13px] text-text-subtle">Loading workspace…</p>
      </PageShell>
    );
  }

  if (error || !project) {
    return (
      <PageShell title="Project not found">
        <EmptyState
          title={error ?? "Project missing"}
          description="The workspace is unavailable until a project exists."
          action={
            <Link to="/dashboard/business/projects" className="text-brand text-[13px] hover:underline">
              ← Back to projects
            </Link>
          }
        />
      </PageShell>
    );
  }

  const receiverId = selectedStudentId(project);
  const studentName = selectedStudentName(project);

  return (
    <PageShell
      title={project.title}
      subtitle={studentName ? `With ${studentName}` : "No student selected yet"}
      actions={<GhostButton icon={<ArrowLeft size={14} />} onClick={() => navigate(-1)}>Back</GhostButton>}
    >
      {!receiverId && (
        <div className="mb-6 flex items-start gap-2 rounded-md border border-status-warning/30 bg-status-warning-soft px-3 py-2.5 text-[12.5px] text-status-warning">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <span>
            No student is selected for this project yet. Chat, deliverables, and payments unlock once a student is hired.
          </span>
        </div>
      )}

      <div className="flex items-center gap-1 border-b border-border-subtle mb-6 overflow-x-auto">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "relative inline-flex items-center gap-2 px-4 py-2.5 text-[13px] transition-colors whitespace-nowrap",
                active ? "text-brand" : "text-text-subtle hover:text-text",
              )}
            >
              <Icon size={14} />
              {t.label}
              {active && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand" />}
            </button>
          );
        })}
      </div>

      {tab === "overview" && <OverviewTab project={project} selectedStudentName={studentName} />}
      {tab === "tasks" && <TasksTab />}
      {tab === "chat" && <ChatTab projectId={project._id} receiverId={receiverId} />}
      {tab === "meetings" && <MeetingsTab />}
      {tab === "files" && <FilesTab />}
      {tab === "deliverables" && <DeliverablesTab projectId={project._id} />}
    </PageShell>
  );
}
