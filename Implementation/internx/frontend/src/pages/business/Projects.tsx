import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { Plus, Eye, Users, AlertCircle, FolderOpen } from "lucide-react";
import { PageShell } from "@/components/forms/PageShell";
import { Panel } from "@/components/forms/Panel";
import { ProgressBar } from "@/components/data-display/ProgressBar";
import { StatusTag, type StatusVariant } from "@/components/data-display/StatusTag";
import { DifficultyTag } from "@/components/data-display/DifficultyTag";
import { PrimaryButton } from "@/components/forms/PrimaryButton";
import { GhostButton } from "@/components/forms/GhostButton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { projectsApi } from "@/lib/api/projects";
import { ApiError } from "@/lib/api/client";
import {
  type BackendProject,
  applicantsCount,
  relativePostedAt,
  uiStatusLabel,
  uiProgress,
} from "@/types/project";
import { cn } from "@/lib/utils/cn";

const TABS = ["All", "In Progress", "Hiring", "Completed", "Open"] as const;
type Tab = typeof TABS[number];

function variantOf(s?: string): StatusVariant {
  if (!s) return "draft";
  if (s.includes("progress")) return "in-progress";
  if (s === "open") return "info";
  if (s.includes("complete")) return "completed";
  return "draft";
}

export default function BusinessProjects() {
  const [projects, setProjects] = useState<BackendProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("All");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await projectsApi.myProjects();
        if (cancelled) return;
        setProjects(res.projects);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Could not load projects.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (tab === "All") return projects;
    return projects.filter((p) => uiStatusLabel(p) === tab);
  }, [projects, tab]);

  return (
    <PageShell
      title="Projects"
      subtitle={loading ? "Loading…" : `${projects.length} project${projects.length === 1 ? "" : "s"} created`}
      actions={
        <Link to="/dashboard/business/projects/new">
          <PrimaryButton size="md" icon={<Plus size={14} />}>New Project</PrimaryButton>
        </Link>
      }
    >
      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-md border border-status-danger/30 bg-status-danger-soft px-3 py-2.5 text-[12.5px] text-status-danger">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!loading && projects.length === 0 ? (
        <Panel padding="p-12">
          <EmptyState
            icon={<FolderOpen size={20} />}
            title="No projects created yet"
            description="Post your first project to start receiving applications from verified students."
            action={
              <Link to="/dashboard/business/projects/new" className="inline-flex items-center gap-1.5 rounded-md bg-brand px-3 py-1.5 text-[12.5px] font-medium text-brand-foreground hover:bg-[#E55F15]">
                <Plus size={13} /> Create your first project
              </Link>
            }
          />
        </Panel>
      ) : (
        <>
          <div className="flex items-center gap-1 border-b border-border-subtle mb-6 overflow-x-auto">
            {TABS.map((t) => {
              const count = t === "All" ? projects.length : projects.filter((p) => uiStatusLabel(p) === t).length;
              const active = tab === t;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "relative px-3 py-2.5 text-[13px] transition-colors whitespace-nowrap",
                    active ? "text-brand" : "text-text-subtle hover:text-text",
                  )}
                >
                  {t}
                  <span className="ml-1.5 inline-flex items-center justify-center rounded-md bg-surface-3 px-1.5 text-[10.5px] text-text-dim">{count}</span>
                  {active && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand" />}
                </button>
              );
            })}
          </div>

          {loading ? (
            <p className="text-[13px] text-text-subtle">Loading…</p>
          ) : filtered.length === 0 ? (
            <EmptyState title={`No ${tab.toLowerCase()} projects`} />
          ) : (
            <div className="grid lg:grid-cols-2 gap-4">
              {filtered.map((b) => (
                <Panel key={b._id} padding="p-5" hover>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[15px] font-semibold text-text">{b.title}</h3>
                      <p className="mt-1 text-[12.5px] text-text-muted line-clamp-2">{b.summary || b.description}</p>
                    </div>
                    <DifficultyTag level={b.difficulty} />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <StatusTag label={uiStatusLabel(b)} variant={variantOf(b.status)} />
                    <span className="text-[11.5px] text-text-subtle capitalize">
                      {b.contractType} · {applicantsCount(b)} applicants · Posted {relativePostedAt(b)}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11.5px] text-text-subtle">
                    <span>{uiProgress(b)}% complete</span>
                  </div>
                  <ProgressBar value={uiProgress(b)} height={4} className="mt-1.5" />
                  <div className="mt-4 flex items-center gap-2 justify-end">
                    <Link to={`/dashboard/business/projects/${b._id}/applicants`}>
                      <GhostButton size="sm" icon={<Users size={13} />}>
                        Applicants ({applicantsCount(b)})
                      </GhostButton>
                    </Link>
                    <Link to={`/dashboard/business/projects/${b._id}/workspace`}>
                      <PrimaryButton size="sm" icon={<Eye size={13} />}>Open Workspace</PrimaryButton>
                    </Link>
                  </div>
                </Panel>
              ))}
            </div>
          )}
        </>
      )}
    </PageShell>
  );
}
