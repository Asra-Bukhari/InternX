import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, AlertCircle } from "lucide-react";
import { PageShell } from "@/components/forms/PageShell";
import { ProjectCard } from "@/components/data-display/ProjectCard";
import { SkillChip } from "@/components/data-display/SkillChip";
import { EmptyState } from "@/components/feedback/EmptyState";
import { OnboardingBanner } from "@/components/feedback/OnboardingBanner";
import { projectsApi } from "@/lib/api/projects";
import { ApiError } from "@/lib/api/client";
import { SKILLS_OPTIONS } from "@/lib/constants/skills";
import { type BackendProject, type Difficulty } from "@/types/project";
import { cn } from "@/lib/utils/cn";

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];
const DURATIONS = ["1 week", "2 weeks", "1 month", "2 months", "3 months", "6+ months"];
const HOURS = ["2-4 hrs/day", "4-6 hrs/day", "6+ hrs/day"];

export default function StudentProjects() {
  const [query, setQuery] = useState("");
  const [activeSkills, setActiveSkills] = useState<string[]>([]);
  const [activeDiff, setActiveDiff] = useState<Difficulty[]>([]);
  const [activeDuration, setActiveDuration] = useState<string[]>([]);
  const [activeHours, setActiveHours] = useState<string[]>([]);
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");

  const [projects, setProjects] = useState<BackendProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await projectsApi.list({
          skillsRequired: activeSkills.length ? activeSkills.join(",") : undefined,
        });
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
  }, [activeSkills]);

  const filtered = useMemo(() => {
    const min = budgetMin ? Number(budgetMin) : 0;
    const max = budgetMax ? Number(budgetMax) : Number.POSITIVE_INFINITY;
    return projects.filter((p) => {
      if (query && !`${p.title} ${p.summary ?? ""} ${p.description}`.toLowerCase().includes(query.toLowerCase())) return false;
      if (activeDiff.length && !activeDiff.includes(p.difficulty)) return false;
      if (activeDuration.length && (!p.durationLabel || !activeDuration.includes(p.durationLabel))) return false;
      if (activeHours.length && (!p.hoursPerDay || !activeHours.includes(p.hoursPerDay))) return false;
      const b = p.budget ?? 0;
      if (b < min || b > max) return false;
      return true;
    });
  }, [projects, query, activeDiff, activeDuration, activeHours, budgetMin, budgetMax]);

  function toggle<T extends string>(set: T[], setter: (n: T[]) => void, val: T) {
    setter(set.includes(val) ? set.filter((x) => x !== val) : [...set, val]);
  }

  return (
    <PageShell title="Available Projects" subtitle={loading ? "Loading…" : `${filtered.length} project${filtered.length === 1 ? "" : "s"} matching your filters`}>
      <OnboardingBanner />

      <div className="mb-6 space-y-4">
        <div className="flex h-10 items-center gap-2 rounded-md border border-border-default bg-surface-2 px-3">
          <Search size={15} className="text-text-subtle" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, summary, or description"
            className="flex-1 bg-transparent text-[13px] text-text outline-none placeholder:text-text-subtle"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          <FilterGroup label="Difficulty">
            {DIFFICULTIES.map((d) => (
              <SkillChip key={d} label={d} active={activeDiff.includes(d)} onClick={() => toggle(activeDiff, setActiveDiff, d)} />
            ))}
          </FilterGroup>
          <FilterGroup label="Duration">
            {DURATIONS.map((d) => (
              <SkillChip key={d} label={d} active={activeDuration.includes(d)} onClick={() => toggle(activeDuration, setActiveDuration, d)} />
            ))}
          </FilterGroup>
          <FilterGroup label="Hours / day">
            {HOURS.map((h) => (
              <SkillChip key={h} label={h} active={activeHours.includes(h)} onClick={() => toggle(activeHours, setActiveHours, h)} />
            ))}
          </FilterGroup>
          <FilterGroup label="Budget (USD)">
            <div className="flex items-center gap-2">
              <input
                type="text"
                inputMode="numeric"
                value={budgetMin}
                onChange={(e) => setBudgetMin(e.target.value.replace(/[^\d]/g, ""))}
                placeholder="Min"
                className="h-8 w-full rounded-md border border-border-default bg-surface-2 px-2 text-[12px] text-text outline-none placeholder:text-text-subtle"
              />
              <span className="text-text-subtle">–</span>
              <input
                type="text"
                inputMode="numeric"
                value={budgetMax}
                onChange={(e) => setBudgetMax(e.target.value.replace(/[^\d]/g, ""))}
                placeholder="Max"
                className="h-8 w-full rounded-md border border-border-default bg-surface-2 px-2 text-[12px] text-text outline-none placeholder:text-text-subtle"
              />
            </div>
          </FilterGroup>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[12px] text-text-subtle"><SlidersHorizontal size={12}/> Technologies:</span>
          {SKILLS_OPTIONS.slice(0, 14).map((s) => (
            <SkillChip key={s} label={s} active={activeSkills.includes(s)} onClick={() => toggle(activeSkills, setActiveSkills, s)} />
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-md border border-status-danger/30 bg-status-danger-soft px-3 py-2.5 text-[12.5px] text-status-danger">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <p className="text-[13px] text-text-subtle">Loading projects…</p>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No projects match those filters"
          description={projects.length === 0 ? "Check back soon — new projects are posted regularly." : "Try removing some filters."}
        />
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <ProjectCard key={p._id} project={p} href={`/dashboard/student/projects/${p._id}`} />
          ))}
        </div>
      )}
    </PageShell>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-md border border-border-subtle bg-surface-2 p-3")}>
      <p className="text-[11px] uppercase tracking-wider text-text-subtle mb-1.5">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}
