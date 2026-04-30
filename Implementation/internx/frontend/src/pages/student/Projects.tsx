import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { PageShell } from "@/components/forms/PageShell";
import { ProjectCard } from "@/components/data-display/ProjectCard";
import { SkillChip } from "@/components/data-display/SkillChip";
import { EmptyState } from "@/components/feedback/EmptyState";
import { PROJECTS, SKILLS } from "@/lib/mock/student";
import type { Difficulty } from "@/types/project";

const DIFFICULTIES: Difficulty[] = ["Basic", "Medium", "Hard", "Hardcore"];

export default function StudentProjects() {
  const [query, setQuery] = useState("");
  const [activeSkills, setActiveSkills] = useState<string[]>([]);
  const [activeDiff, setActiveDiff] = useState<Difficulty[]>([]);

  const filtered = useMemo(() => {
    return PROJECTS.filter((p) => {
      if (query && !`${p.title} ${p.business} ${p.description}`.toLowerCase().includes(query.toLowerCase())) return false;
      if (activeSkills.length && !p.skills.some((s) => activeSkills.includes(s))) return false;
      if (activeDiff.length && !activeDiff.includes(p.difficulty)) return false;
      return true;
    });
  }, [query, activeSkills, activeDiff]);

  function toggleSkill(s: string) {
    setActiveSkills((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));
  }
  function toggleDiff(d: Difficulty) {
    setActiveDiff((cur) => (cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d]));
  }

  return (
    <PageShell title="Available Projects" subtitle={`${filtered.length} projects matching your filters`}>
      {/* Search + filters */}
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
          {SKILLS.slice(0, 14).map((s) => (
            <SkillChip key={s} label={s} active={activeSkills.includes(s)} onClick={() => toggleSkill(s)} />
          ))}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <EmptyState title="No projects match those filters" description="Try removing some filters or broadening your search." />
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
