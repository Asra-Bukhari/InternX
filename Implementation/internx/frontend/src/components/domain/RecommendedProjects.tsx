import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Sparkles, TrendingUp, AlertCircle } from "lucide-react";
import { Panel } from "@/components/forms/Panel";
import { SectionHeader } from "@/components/domain/SectionHeader";
import { useAuth } from "@/lib/auth/useAuth";
import { recommendationsApi, type ProjectRecommendation } from "@/lib/api/ai";
import { cn } from "@/lib/utils/cn";

export function RecommendedProjects() {
  const { user } = useAuth();
  const [recs, setRecs] = useState<ProjectRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await recommendationsApi.projectsForStudent(user!.id);
        if (!cancelled) setRecs(res.recommendations ?? []);
      } catch (err) {
        if (!cancelled) setError("Could not load recommendations.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [user]);

  if (!loading && recs.length === 0 && !error) return null;

  return (
    <div className="mb-8">
      <SectionHeader
        title="Recommended For You"
        description="AI-powered project recommendations based on your skills and profile"
      />

      {error && (
        <div className="flex items-start gap-2 rounded-md border border-status-danger/30 bg-status-danger-soft px-3 py-2.5 text-[12.5px] text-status-danger mb-4">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Panel key={i} padding="p-5" className="animate-pulse space-y-3">
              <div className="h-4 bg-surface-3 rounded w-3/4" />
              <div className="h-3 bg-surface-3 rounded w-1/2" />
              <div className="h-3 bg-surface-3 rounded w-full" />
            </Panel>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {recs.map((rec) => (
            <Link
              key={rec.projectId}
              to={`/dashboard/student/projects/${rec.projectId}`}
              className="block"
            >
              <Panel hover padding="p-5" className="h-full space-y-3 group">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold text-text truncate group-hover:text-brand transition-colors">
                      {rec.title}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "flex-shrink-0 flex items-center gap-1 rounded-md px-2 py-1 text-[12px] font-bold",
                      rec.matchScore >= 80
                        ? "bg-status-success/15 text-status-success"
                        : rec.matchScore >= 60
                        ? "bg-status-info/15 text-status-info"
                        : "bg-status-warning/15 text-status-warning"
                    )}
                  >
                    <TrendingUp size={12} />
                    {rec.matchScore}%
                  </div>
                </div>

                <p className="text-[12.5px] text-text-muted leading-relaxed line-clamp-2">
                  {rec.reason}
                </p>

                <div className="flex items-center gap-1.5 text-[11px] text-brand">
                  <Sparkles size={11} />
                  <span>AI Matched</span>
                </div>
              </Panel>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
