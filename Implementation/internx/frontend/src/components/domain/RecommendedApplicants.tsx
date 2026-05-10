import { useEffect, useState } from "react";
import { Sparkles, TrendingUp, AlertCircle, Bot } from "lucide-react";
import { Panel } from "@/components/forms/Panel";
import { SectionHeader } from "@/components/domain/SectionHeader";
import { recommendationsApi, type ApplicantRecommendation } from "@/lib/api/ai";
import { cn } from "@/lib/utils/cn";

interface Props {
  projectId: string;
}

export function RecommendedApplicants({ projectId }: Props) {
  const [recs, setRecs] = useState<ApplicantRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await recommendationsApi.applicantsForProject(projectId);
        if (!cancelled) setRecs(res.recommendations ?? []);
      } catch {
        if (!cancelled) setError("Could not load AI recommendations.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [projectId]);

  if (!loading && recs.length === 0 && !error) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="grid h-7 w-7 place-items-center rounded-md bg-brand/15">
          <Bot size={14} className="text-brand" />
        </div>
        <div>
          <h3 className="text-[14px] font-semibold text-text">AI Recommended Ranking</h3>
          <p className="text-[11px] text-text-subtle">Applicants ranked by AI skill matching</p>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-md border border-status-danger/30 bg-status-danger-soft px-3 py-2.5 text-[12.5px] text-status-danger mb-3">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Panel key={i} padding="p-4" className="animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-surface-3" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-surface-3 rounded w-1/3" />
                  <div className="h-2 bg-surface-3 rounded w-2/3" />
                </div>
              </div>
            </Panel>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {recs.map((rec, index) => {
            const initials = rec.name
              .split(" ")
              .map((p) => p[0])
              .filter(Boolean)
              .slice(0, 2)
              .join("")
              .toUpperCase() || "S";

            return (
              <Panel key={rec.applicationId} padding="p-4" className="flex items-center gap-3">
                {/* Rank badge */}
                <div
                  className={cn(
                    "grid h-7 w-7 flex-shrink-0 place-items-center rounded-full text-[11px] font-bold",
                    index === 0
                      ? "bg-brand/20 text-brand"
                      : index === 1
                      ? "bg-status-info/15 text-status-info"
                      : "bg-surface-3 text-text-subtle"
                  )}
                >
                  #{index + 1}
                </div>

                {/* Avatar */}
                <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-brand/15 text-[13px] font-semibold text-brand">
                  {initials}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold text-text truncate">{rec.name}</p>
                  <p className="text-[12px] text-text-muted truncate">{rec.reason}</p>
                </div>

                {/* Score */}
                <div
                  className={cn(
                    "flex-shrink-0 flex items-center gap-1 rounded-md px-2.5 py-1 text-[12px] font-bold",
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

                <Sparkles size={12} className="text-brand/50 flex-shrink-0" />
              </Panel>
            );
          })}
        </div>
      )}
    </div>
  );
}
