import { useMemo, useState } from "react";
import { Search, X, Lock } from "lucide-react";
import { SKILLS_OPTIONS, MAX_SKILLS } from "@/lib/constants/skills";
import { SkillChip } from "@/components/data-display/SkillChip";
import { cn } from "@/lib/utils/cn";

interface Props {
  value: string[];
  onChange: (next: string[]) => void;
  lockedDaysLeft?: number;
}

export function SkillSelector({ value, onChange, lockedDaysLeft = 0 }: Props) {
  const [query, setQuery] = useState("");
  const locked = lockedDaysLeft > 0;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SKILLS_OPTIONS.slice(0, 24);
    return SKILLS_OPTIONS.filter((s) => s.toLowerCase().includes(q)).slice(0, 30);
  }, [query]);

  function toggle(skill: string) {
    if (locked) return;
    if (value.includes(skill)) {
      onChange(value.filter((s) => s !== skill));
      return;
    }
    if (value.length >= MAX_SKILLS) return;
    onChange([...value, skill]);
  }

  const limitReached = value.length >= MAX_SKILLS;

  return (
    <div>
      {locked && (
        <div className="mb-3 flex items-start gap-2 rounded-md border border-status-warning/30 bg-status-warning-soft px-3 py-2.5 text-[12.5px] text-status-warning">
          <Lock size={14} className="mt-0.5 flex-shrink-0" />
          <span>
            Skills are locked. You can update skills again in {lockedDaysLeft} day{lockedDaysLeft === 1 ? "" : "s"}.
          </span>
        </div>
      )}

      <div className="flex items-center justify-between mb-2 text-[12px]">
        <span className="text-text-subtle">
          Selected {value.length} / {MAX_SKILLS}
        </span>
        {limitReached && (
          <span className="text-status-warning">Limit reached. Remove one to add another.</span>
        )}
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4 p-3 rounded-md border border-border-default bg-surface-2">
          {value.map((s) => (
            <span
              key={s}
              className={cn(
                "inline-flex items-center gap-1 rounded-md bg-brand/15 px-2 py-1 text-[12px] font-medium text-brand",
                locked && "opacity-60",
              )}
            >
              {s}
              {!locked && (
                <button type="button" onClick={() => toggle(s)} aria-label={`Remove ${s}`}>
                  <X size={12} />
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      <div className={cn("flex h-10 items-center gap-2 rounded-md border border-border-default bg-surface-2 px-3", locked && "opacity-60")}>
        <Search size={14} className="text-text-subtle" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search skills…"
          disabled={locked}
          className="flex-1 bg-transparent text-[13px] text-text outline-none placeholder:text-text-subtle"
        />
      </div>

      <div className={cn("mt-3 flex flex-wrap gap-1.5", locked && "opacity-60")}>
        {filtered.map((s) => (
          <SkillChip
            key={s}
            label={s}
            active={value.includes(s)}
            onClick={() => toggle(s)}
          />
        ))}
        {filtered.length === 0 && (
          <p className="text-[12.5px] text-text-subtle">No skills match "{query}".</p>
        )}
      </div>
    </div>
  );
}
