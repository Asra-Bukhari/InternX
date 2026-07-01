import { useState } from "react";
import { ChevronDown, X, Lock } from "lucide-react";
import { SKILL_CATEGORIES, MAX_SKILLS, MAX_SKILL_CATEGORIES } from "@/lib/constants/skills";
import { cn } from "@/lib/utils/cn";

interface Props {
  value: string[];
  onChange: (next: string[]) => void;
  lockedDaysLeft?: number;
}

export function SkillSelector({ value, onChange, lockedDaysLeft = 0 }: Props) {
  const [open, setOpen] = useState<string | null>(null);
  const locked = lockedDaysLeft > 0;

  // Which categories currently have at least one selected skill
  const activeCats = SKILL_CATEGORIES.filter((c) =>
    c.skills.some((s) => value.includes(s))
  ).map((c) => c.name);

  function toggle(skill: string, catName: string) {
    if (locked) return;
    if (value.includes(skill)) {
      onChange(value.filter((s) => s !== skill));
      return;
    }
    if (value.length >= MAX_SKILLS) return;
    // Block if this would introduce a 3rd category
    if (!(activeCats as string[]).includes(catName) && activeCats.length >= MAX_SKILL_CATEGORIES) return;
    onChange([...value, skill]);
  }

  const limitReached = value.length >= MAX_SKILLS;

  return (
    <div>
      {locked && (
        <div className="mb-3 flex items-start gap-2 rounded-md border border-status-warning/30 bg-status-warning-soft px-3 py-2.5 text-[12.5px] text-status-warning">
          <Lock size={14} className="mt-0.5 flex-shrink-0" />
          <span>Skills are locked. You can update again in {lockedDaysLeft} day{lockedDaysLeft === 1 ? "" : "s"}.</span>
        </div>
      )}

      <div className="flex items-center justify-between mb-2 text-[12px]">
        <span className="text-text-subtle">
          {value.length}/{MAX_SKILLS} selected · max {MAX_SKILL_CATEGORIES} categories
        </span>
        {limitReached && (
          <span className="text-status-warning">Limit reached.</span>
        )}
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4 p-3 rounded-md border border-border-default bg-surface-2">
          {value.map((s) => (
            <span key={s} className={cn("inline-flex items-center gap-1 rounded-md bg-brand/15 px-2 py-1 text-[12px] font-medium text-brand", locked && "opacity-60")}>
              {s}
              {!locked && (
                <button type="button" onClick={() => onChange(value.filter((x) => x !== s))} aria-label={`Remove ${s}`}>
                  <X size={12} />
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      <div className={cn("space-y-1", locked && "opacity-60")}>
        {SKILL_CATEGORIES.map((cat) => {
          const isOpen = open === cat.name;
          const catActive = activeCats.includes(cat.name);
          const catBlocked = !catActive && activeCats.length >= MAX_SKILL_CATEGORIES;
          return (
            <div key={cat.name} className="rounded-md border border-border-default overflow-hidden">
              <button
                type="button"
                disabled={locked}
                onClick={() => setOpen(isOpen ? null : cat.name)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-2.5 text-[13px] font-medium text-left",
                  catActive ? "bg-brand/10 text-brand" : "bg-surface-2 text-text",
                  catBlocked && "opacity-40 cursor-not-allowed",
                )}
              >
                <span>{cat.name}{catActive ? ` (${cat.skills.filter(s => value.includes(s)).length})` : ""}</span>
                <ChevronDown size={14} className={cn("transition-transform", isOpen && "rotate-180")} />
              </button>
              {isOpen && (
                <div className="px-4 py-3 bg-surface-1 flex flex-wrap gap-1.5">
                  {cat.skills.map((s) => {
                    const selected = value.includes(s);
                    const blocked = !selected && (limitReached || (catBlocked));
                    return (
                      <button
                        key={s}
                        type="button"
                        disabled={blocked || locked}
                        onClick={() => toggle(s, cat.name)}
                        className={cn(
                          "rounded-md border px-2.5 py-1 text-[12px] transition-colors",
                          selected
                            ? "border-brand bg-brand/15 text-brand"
                            : blocked
                            ? "border-border-subtle text-text-subtle opacity-40 cursor-not-allowed"
                            : "border-border-default bg-surface-2 text-text-dim hover:border-brand/50 hover:text-text",
                        )}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
