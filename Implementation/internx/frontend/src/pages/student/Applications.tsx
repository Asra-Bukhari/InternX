import { useEffect, useState } from "react";
import { Link } from "react-router";
import { FileText, AlertCircle } from "lucide-react";
import { PageShell } from "@/components/forms/PageShell";
import { Panel } from "@/components/forms/Panel";
import { StatusTag } from "@/components/data-display/StatusTag";
import { EmptyState } from "@/components/feedback/EmptyState";
import { applicationsApi } from "@/lib/api/applications";
import { ApiError } from "@/lib/api/client";
import {
  type BackendApplication,
  type ApplicationStatus,
  projectIdOf,
  projectTitleOf,
  projectBusinessNameOf,
} from "@/types/application";
import { cn } from "@/lib/utils/cn";

const TABS: { key: ApplicationStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "rejected", label: "Rejected" },
];

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return "";
  }
}

export default function StudentApplications() {
  const [tab, setTab] = useState<ApplicationStatus | "all">("all");
  const [apps, setApps] = useState<BackendApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await applicationsApi.myApplications();
        if (cancelled) return;
        setApps(res);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Could not load applications.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = tab === "all" ? apps : apps.filter((a) => a.status === tab);

  return (
    <PageShell
      title="My Applications"
      subtitle={loading ? "Loading…" : `${apps.length} application${apps.length === 1 ? "" : "s"}`}
    >
      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-md border border-status-danger/30 bg-status-danger-soft px-3 py-2.5 text-[12.5px] text-status-danger">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center gap-1 border-b border-border-subtle mb-6">
        {TABS.map((t) => {
          const count = t.key === "all" ? apps.length : apps.filter((a) => a.status === t.key).length;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "relative px-3 py-2.5 text-[13px] transition-colors",
                active ? "text-brand" : "text-text-subtle hover:text-text",
              )}
            >
              {t.label}
              <span className="ml-1.5 inline-flex items-center justify-center rounded-md bg-surface-3 px-1.5 text-[10.5px] text-text-dim">{count}</span>
              {active && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand" />}
            </button>
          );
        })}
      </div>

      {loading ? (
        <p className="text-[13px] text-text-subtle">Loading…</p>
      ) : filtered.length === 0 ? (
        <Panel padding="p-12">
          <EmptyState
            icon={<FileText size={20} />}
            title="No applications here"
            description="When you apply to projects, they'll show up in this list."
            action={<Link to="/dashboard/student/projects" className="text-brand text-[13px] hover:underline">Browse projects →</Link>}
          />
        </Panel>
      ) : (
        <ul className="space-y-3">
          {filtered.map((a) => {
            const projectId = projectIdOf(a);
            const title = projectTitleOf(a);
            const business = projectBusinessNameOf(a);
            const initials =
              business
                .split(" ")
                .map((p) => p[0])
                .filter(Boolean)
                .slice(0, 2)
                .join("")
                .toUpperCase() || "B";
            return (
              <Panel key={a._id} padding="p-5" className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="grid h-11 w-11 place-items-center rounded-md bg-surface-3 text-[12px] font-semibold text-text-dim flex-shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <Link
                      to={`/dashboard/student/projects/${projectId}`}
                      className="text-[14px] font-semibold text-text truncate hover:text-brand block"
                    >
                      {title}
                    </Link>
                    <p className="text-[12px] text-text-subtle truncate">
                      {business} · Applied {formatDate(a.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <StatusTag
                    label={a.status[0].toUpperCase() + a.status.slice(1)}
                    variant={a.status === "accepted" ? "approved" : a.status === "rejected" ? "rejected" : "pending"}
                  />
                </div>
              </Panel>
            );
          })}
        </ul>
      )}
    </PageShell>
  );
}
