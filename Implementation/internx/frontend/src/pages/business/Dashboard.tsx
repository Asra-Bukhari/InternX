import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, FolderOpen, Users, CheckCircle2, DollarSign, Package, AlertCircle, Plus } from "lucide-react";
import { PageShell } from "@/components/forms/PageShell";
import { Panel } from "@/components/forms/Panel";
import { KPIStat } from "@/components/domain/KPIStat";
import { SectionHeader } from "@/components/domain/SectionHeader";
import { ProgressBar } from "@/components/data-display/ProgressBar";
import { StatusTag, type StatusVariant } from "@/components/data-display/StatusTag";
import { DifficultyTag } from "@/components/data-display/DifficultyTag";
import { PrimaryButton } from "@/components/forms/PrimaryButton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { useAuth } from "@/lib/auth/useAuth";
import { projectsApi } from "@/lib/api/projects";
import { paymentsApi, type BackendPayment } from "@/lib/api/payments";
import { ApiError } from "@/lib/api/client";
import { type BackendProject, applicantsCount, uiStatusLabel, uiProgress } from "@/types/project";

function statusVariant(s?: string): StatusVariant {
  if (!s) return "draft";
  if (s.includes("progress")) return "in-progress";
  if (s === "open") return "info";
  if (s.includes("complete")) return "completed";
  return "draft";
}

export default function BusinessDashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<BackendProject[]>([]);
  const [payments, setPayments] = useState<BackendPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [proj, pay] = await Promise.all([
          projectsApi.myProjects().catch(() => ({ projects: [], count: 0 })),
          paymentsApi.myPayments().catch(() => [] as BackendPayment[]),
        ]);
        if (cancelled) return;
        setProjects(proj.projects);
        setPayments(pay);
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
    const active = projects.filter((p) => p.status === "in-progress").length;
    const hiring = projects.filter((p) => p.status === "open").length;
    const completed = projects.filter((p) => p.status === "completed").length;
    const totalApplicants = projects.reduce((sum, p) => sum + applicantsCount(p), 0);
    const totalSpent = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
    return { active, hiring, completed, totalApplicants, totalSpent };
  }, [projects, payments]);

  if (!user) return null;
  const greeting = user.name.split(" ")[0] || "there";

  return (
    <PageShell
      title={`Welcome, ${greeting}`}
      subtitle={user.name}
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

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <KPIStat label="Active" value={loading ? "—" : stats.active} icon={<FolderOpen size={16} />} accent="brand" />
        <KPIStat label="Hiring" value={loading ? "—" : stats.hiring} trend={`${stats.totalApplicants} applicants`} icon={<Users size={16} />} accent="info" />
        <KPIStat label="Completed" value={loading ? "—" : stats.completed} icon={<CheckCircle2 size={16} />} accent="success" />
        <KPIStat label="Total Spent" value={loading ? "—" : `$${stats.totalSpent.toLocaleString()}`} icon={<DollarSign size={16} />} accent="warning" />
        <KPIStat label="Pending" value={0} trend="Deliverables" icon={<Package size={16} />} accent="default" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SectionHeader
            title="Your projects"
            action={
              <Link to="/dashboard/business/projects" className="text-[12.5px] text-brand hover:underline inline-flex items-center gap-1">
                All projects <ArrowRight size={12} />
              </Link>
            }
          />
          {loading ? (
            <p className="text-[13px] text-text-subtle">Loading…</p>
          ) : projects.length === 0 ? (
            <Panel padding="p-12">
              <EmptyState
                icon={<FolderOpen size={20} />}
                title="No projects yet"
                description="Post your first project to start hiring verified students."
                action={
                  <Link to="/dashboard/business/projects/new" className="inline-flex items-center gap-1 text-[13px] text-brand hover:underline">
                    Create project <ArrowRight size={13} />
                  </Link>
                }
              />
            </Panel>
          ) : (
            <div className="space-y-3">
              {projects.slice(0, 4).map((b) => (
                <Panel key={b._id} padding="p-5" hover>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <Link to={`/dashboard/business/projects/${b._id}/workspace`} className="flex-1">
                      <h3 className="text-[15px] font-semibold text-text hover:text-brand">{b.title}</h3>
                      <p className="mt-1 text-[12.5px] text-text-muted line-clamp-2">{b.summary || b.description}</p>
                    </Link>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <DifficultyTag level={b.difficulty} />
                      <StatusTag label={uiStatusLabel(b)} variant={statusVariant(b.status)} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[12px] text-text-subtle">
                    <div className="flex gap-4">
                      <span>{applicantsCount(b)} applicants</span>
                      <span className="capitalize">{b.contractType}</span>
                    </div>
                    <span>{uiProgress(b)}%</span>
                  </div>
                  <div className="mt-2"><ProgressBar value={uiProgress(b)} height={4} /></div>
                </Panel>
              ))}
            </div>
          )}
        </div>

        <aside>
          <SectionHeader title="Recent applicants" action={
            <Link to="/dashboard/business/applicants" className="text-[12.5px] text-brand hover:underline">View all</Link>
          } />
          <Panel padding="p-5">
            {loading ? (
              <p className="text-[12.5px] text-text-subtle">Loading…</p>
            ) : stats.totalApplicants === 0 ? (
              <p className="text-[12.5px] text-text-subtle">No applicants yet.</p>
            ) : (
              <p className="text-[12.5px] text-text-subtle">
                {stats.totalApplicants} applicant{stats.totalApplicants === 1 ? "" : "s"} across your projects.
              </p>
            )}
          </Panel>
        </aside>
      </div>
    </PageShell>
  );
}
