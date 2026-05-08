import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, AlertCircle } from "lucide-react";
import { PageShell } from "@/components/forms/PageShell";
import { ProjectCard } from "@/components/data-display/ProjectCard";
import { SkillChip } from "@/components/data-display/SkillChip";
import { EmptyState } from "@/components/feedback/EmptyState";
import { OnboardingBanner } from "@/components/feedback/OnboardingBanner";
import { projectsApi, adaptProject } from "@/lib/api/projects";
import { ApiError } from "@/lib/api/client";
import { SKILLS_OPTIONS } from "@/lib/constants/skills";
import type { Project, Difficulty } from "@/types/project";

const DIFFICULTIES: Difficulty[] = ["Basic", "Medium", "Hard"];

export default function StudentProjects() {
  const [query, setQuery] = useState("");
  const [activeSkills, setActiveSkills] = useState<string[]>([]);
  const [activeDiff, setActiveDiff] = useState<Difficulty[]>([]);

  const [projects, setProjects] = useState<Project[]>([]);
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
        setProjects(res.projects.map(adaptProject));
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
    return projects.filter((p) => {
      if (query && !`${p.title} ${p.business} ${p.description}`.toLowerCase().includes(query.toLowerCase())) return false;
      if (activeDiff.length && !activeDiff.includes(p.difficulty)) return false;
      return true;
    });
  }, [projects, query, activeDiff]);

  function toggleSkill(s: string) {
    setActiveSkills((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));
  }
  function toggleDiff(d: Difficulty) {
    setActiveDiff((cur) => (cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d]));
  }

  return (
    <PageShell title="Available Projects" subtitle={loading ? "Loading…" : `${filtered.length} projects matching your filters`}>
      <OnboardingBanner />

      <div className="mb-6 space-y-4">
        <div className="flex h-10 items-center gap-2 rounded-md border border-border-default bg-surface-2 px-3">
          <Search size={15} className="text-text-subtle" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, company, or description"
            className="flex-1 bg-transparent text-[13px] text-text outline-none placeholder:text-text-subtle"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[12px] text-text-subtle"><SlidersHorizontal size={12}/> Difficulty:</span>
          {DIFFICULTIES.map((d) => (
            <SkillChip key={d} label={d} active={activeDiff.includes(d)} onClick={() => toggleDiff(d)} />
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {SKILLS_OPTIONS.slice(0, 14).map((s) => (
            <SkillChip key={s} label={s} active={activeSkills.includes(s)} onClick={() => toggleSkill(s)} />
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
          description={projects.length === 0 ? "Check back soon — new projects are posted regularly." : "Try removing some filters or broadening your search."}
        />
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} href={`/dashboard/student/projects/${p.id}`} />
          ))}
        </div>
      )}
    </PageShell>
  );
}
