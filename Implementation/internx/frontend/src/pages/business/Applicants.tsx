import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Users, AlertCircle } from "lucide-react";
import { PageShell } from "@/components/forms/PageShell";
import { Panel } from "@/components/forms/Panel";
import { EmptyState } from "@/components/feedback/EmptyState";
import { projectsApi } from "@/lib/api/projects";
import { ApiError } from "@/lib/api/client";
import { type BackendProject, applicantsCount } from "@/types/project";

export default function BusinessApplicants() {
  const [projects, setProjects] = useState<BackendProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setError(err instanceof ApiError ? err.message : "Could not load applicants.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalApplicants = projects.reduce((s, p) => s + applicantsCount(p), 0);

  return (
    <PageShell
      title="Applicants"
      subtitle={loading ? "Loading…" : `${totalApplicants} applicant${totalApplicants === 1 ? "" : "s"} across your projects`}
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
            icon={<Users size={20} />}
            title="No projects yet"
            description="Create a project to start receiving applications."
            action={
              <Link to="/dashboard/business/projects/new" className="text-brand text-[13px] hover:underline">
                Create a project →
              </Link>
            }
          />
        </Panel>
      ) : !loading && totalApplicants === 0 ? (
        <Panel padding="p-12">
          <EmptyState
            icon={<Users size={20} />}
            title="No applicants yet"
            description="Once students apply to your open projects, they'll appear here."
          />
        </Panel>
      ) : (
        <div className="space-y-4">
          {projects.map((p) => {
            const count = applicantsCount(p);
            if (count === 0) return null;
            return (
              <Panel key={p._id} padding="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link to={`/dashboard/business/projects/${p._id}/applicants`} className="text-[14px] font-semibold text-text hover:text-brand">
                      {p.title}
                    </Link>
                    <p className="text-[12px] text-text-subtle mt-0.5">
                      {count} of 10 applicants
                    </p>
                  </div>
                  <Link to={`/dashboard/business/projects/${p._id}/applicants`} className="text-[12.5px] text-brand hover:underline flex-shrink-0">
                    Review applicants →
                  </Link>
                </div>
              </Panel>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}
