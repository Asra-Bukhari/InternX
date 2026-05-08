import { Link } from "react-router";
import { ArrowRight, Briefcase, Award, DollarSign, CheckCircle2, FolderOpen } from "lucide-react";
import { PageShell } from "@/components/forms/PageShell";
import { Panel } from "@/components/forms/Panel";
import { KPIStat } from "@/components/domain/KPIStat";
import { SectionHeader } from "@/components/domain/SectionHeader";
import { ProgressBar } from "@/components/data-display/ProgressBar";
import { EmptyState } from "@/components/feedback/EmptyState";
import { OnboardingBanner } from "@/components/feedback/OnboardingBanner";
import { useAuth } from "@/lib/auth/useAuth";
import { levelForCount, nextLevelDelta } from "@/lib/constants/levels";

export default function StudentDashboard() {
  const { user, profile, profileComplete } = useAuth();
  if (!user) return null;

  const completed = profile?.completedProjects ?? 0;
  const rating = profile?.rating ?? 0;
  const { level } = levelForCount(completed);
  const { next, remaining, pct } = nextLevelDelta(completed);

  const subtitle = `${level.name}${profile?.university ? ` · ${profile.university}` : ""}`;

  return (
    <PageShell title={`Welcome back, ${user.name.split(" ")[0]}`} subtitle={subtitle}>
      <OnboardingBanner />

      {/* KPIs — all real, fresh accounts show 0 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KPIStat label="Earnings" value="—" trend="No payouts yet" icon={<DollarSign size={16} />} accent="brand" />
        <KPIStat label="Completed" value={completed} trend="All-time" icon={<CheckCircle2 size={16} />} accent="success" />
        <KPIStat label="Active Apps" value={0} trend="Awaiting review" icon={<Briefcase size={16} />} accent="info" />
        <KPIStat label="Rating" value={rating ? rating.toFixed(1) : "—"} trend={rating ? "Across reviews" : "No reviews yet"} icon={<Award size={16} />} accent="warning" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Active project — empty state for fresh accounts */}
          <Panel padding="p-6">
            <SectionHeader
              title="Your active project"
              description="One active project at a time."
            />
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
          </Panel>

          {/* Recommended */}
          <div>
            <SectionHeader
              title="Browse projects"
              description="Find your next opportunity"
              action={
                <Link to="/dashboard/student/projects" className="text-[12.5px] text-brand hover:underline inline-flex items-center gap-1">
                  See all <ArrowRight size={12} />
                </Link>
              }
            />
            <Panel padding="p-6">
              <p className="text-[13px] text-text-muted">
                Visit the Projects page to browse all open opportunities matching your skills.
              </p>
            </Panel>
          </div>
        </div>

        <aside className="space-y-6">
          <Panel padding="p-5">
            <SectionHeader
              title="Recent applications"
              action={
                <Link to="/dashboard/student/applications" className="text-[12.5px] text-brand hover:underline">View all</Link>
              }
            />
            <p className="text-[12.5px] text-text-subtle">No applications yet.</p>
          </Panel>

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
