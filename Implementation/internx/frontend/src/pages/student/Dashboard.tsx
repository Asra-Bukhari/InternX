import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Briefcase, Award, DollarSign, CheckCircle2, FolderOpen, AlertCircle } from "lucide-react";
import { PageShell } from "@/components/forms/PageShell";
import { Panel } from "@/components/forms/Panel";
import { KPIStat } from "@/components/domain/KPIStat";
import { SectionHeader } from "@/components/domain/SectionHeader";
import { ProgressBar } from "@/components/data-display/ProgressBar";
import { StatusTag } from "@/components/data-display/StatusTag";
import { EmptyState } from "@/components/feedback/EmptyState";
import { OnboardingBanner } from "@/components/feedback/OnboardingBanner";
import { useAuth } from "@/lib/auth/useAuth";
import { applicationsApi } from "@/lib/api/applications";
import { projectsApi } from "@/lib/api/projects";
import { ApiError } from "@/lib/api/client";
import { levelForCount, nextLevelDelta } from "@/lib/constants/levels";
import { type BackendProject } from "@/types/project";
import {
  type BackendApplication,
  projectIdOf,
  projectTitleOf,
  projectBusinessNameOf,
} from "@/types/application";

export default function StudentDashboard() {
  const { user, profile, profileComplete } = useAuth();
  const [apps, setApps] = useState<BackendApplication[]>([]);
  const [activeProject, setActiveProject] = useState<BackendProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const myApps = await applicationsApi.myApplications().catch(() => [] as BackendApplication[]);
        if (cancelled) return;
        setApps(myApps);
        const accepted = myApps.find((a) => a.status === "accepted");
        if (accepted) {
          const pid = typeof accepted.projectId === "string" ? accepted.projectId : accepted.projectId._id;
          try {
            const proj = await projectsApi.get(pid);
            if (!cancelled) setActiveProject(proj.project);
          } catch {
            /* ignore */
          }
        }
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Could not load dashboard.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const stats = useMemo(() => {
    const pending = apps.filter((a) => a.status === "pending").length;
    const accepted = apps.filter((a) => a.status === "accepted").length;
    return { pending, accepted };
  }, [apps]);

  if (!user) return null;

  const completed = profile?.completedProjects ?? 0;
  const rating = profile?.rating ?? 0;
  const { level } = levelForCount(completed);
  const { next, remaining, pct } = nextLevelDelta(completed);

  return (
    <PageShell title={`Welcome back, ${user.name.split(" ")[0]}`} subtitle={`${level.name}${profile?.university ? ` · ${profile.university}` : ""}`}>
      <OnboardingBanner />

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-md border border-status-danger/30 bg-status-danger-soft px-3 py-2.5 text-[12.5px] text-status-danger">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KPIStat label="Earnings" value="—" trend="No payouts yet" icon={<DollarSign size={16} />} accent="brand" />
        <KPIStat label="Completed" value={completed} trend="All-time" icon={<CheckCircle2 size={16} />} accent="success" />
        <KPIStat label="Active Apps" value={loading ? "—" : stats.pending} trend="Awaiting review" icon={<Briefcase size={16} />} accent="info" />
        <KPIStat label="Rating" value={rating ? rating.toFixed(1) : "—"} trend={rating ? "Across reviews" : "No reviews yet"} icon={<Award size={16} />} accent="warning" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Panel padding="p-6">
            <SectionHeader title="Your active project" description="One active project at a time." />
            {activeProject ? (
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-[15px] font-semibold text-text">{activeProject.title}</h3>
                    <p className="mt-1 text-[12.5px] text-text-muted line-clamp-2">{activeProject.summary || activeProject.description}</p>
                  </div>
                  <StatusTag label="In Progress" variant="in-progress" />
                </div>
                <Link to="/dashboard/student/active" className="text-[12.5px] text-brand hover:underline inline-flex items-center gap-1">
                  Open active project <ArrowRight size={12} />
                </Link>
              </div>
            ) : (
              <EmptyState
                icon={<FolderOpen size={20} />}
                title="No active project"
                description={
                  profileComplete
                    ? "Browse open projects and apply to get started."
                    : "Complete your profile to start applying for projects."
                }
                action={
                  <Link
                    to={profileComplete ? "/dashboard/student/projects" : "/dashboard/student/profile/setup"}
                    className="inline-flex items-center gap-1 text-[13px] text-brand hover:underline"
                  >
                    {profileComplete ? "Browse projects" : "Complete profile"} <ArrowRight size={13} />
                  </Link>
                }
              />
            )}
          </Panel>

          <div>
            <SectionHeader
              title="Recent applications"
              action={
                <Link to="/dashboard/student/applications" className="text-[12.5px] text-brand hover:underline inline-flex items-center gap-1">
                  See all <ArrowRight size={12} />
                </Link>
              }
            />
            {loading ? (
              <p className="text-[12.5px] text-text-subtle">Loading…</p>
            ) : apps.length === 0 ? (
              <Panel padding="p-6">
                <p className="text-[13px] text-text-muted">
                  No applications yet. Visit the Projects page to find opportunities.
                </p>
              </Panel>
            ) : (
              <div className="space-y-2">
                {apps.slice(0, 4).map((a) => (
                  <Panel key={a._id} padding="p-4" className="flex items-center justify-between">
                    <div>
                      <Link to={`/dashboard/student/projects/${projectIdOf(a)}`} className="text-[13px] font-semibold text-text hover:text-brand">
                        {projectTitleOf(a)}
                      </Link>
                      <p className="text-[11.5px] text-text-subtle">{projectBusinessNameOf(a)}</p>
                    </div>
                    <StatusTag
                      label={a.status[0].toUpperCase() + a.status.slice(1)}
                      variant={a.status === "accepted" ? "approved" : a.status === "rejected" ? "rejected" : "pending"}
                    />
                  </Panel>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <Panel padding="p-5">
            <h3 className="text-[14px] font-semibold text-text">Level progress</h3>
            <p className="mt-1 text-[12px] text-text-subtle">
              {next
                ? <>{remaining} more project{remaining === 1 ? "" : "s"} until <span className="text-brand">{next.name}</span></>
                : "You've reached the top tier."}
            </p>
            <div className="mt-4">
              <ProgressBar value={pct} />
            </div>
            <Link to="/dashboard/student/levels" className="mt-4 inline-flex items-center gap-1 text-[12.5px] text-brand hover:underline">
              See all levels <ArrowRight size={12} />
            </Link>
          </Panel>
        </aside>
      </div>
    </PageShell>
  );
}
