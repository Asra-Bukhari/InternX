import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/forms/FormField";
import { GhostButton } from "@/components/forms/GhostButton";
import type { PortfolioProject } from "@/types/profile";

interface Props {
  value: PortfolioProject[];
  onChange: (next: PortfolioProject[]) => void;
}

const MIN = 3;
const MAX = 5;

function makeId(): string {
  return `pp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function PortfolioEditor({ value, onChange }: Props) {
  function update(idx: number, patch: Partial<PortfolioProject>) {
    onChange(value.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
  }
  function remove(idx: number) {
    if (value.length <= 1) return;
    onChange(value.filter((_, i) => i !== idx));
  }
  function add() {
    if (value.length >= MAX) return;
    onChange([...value, { id: makeId(), title: "", description: "", technologies: [] }]);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3 text-[12px]">
        <span className="text-text-subtle">
          {value.length} project{value.length === 1 ? "" : "s"} · need at least {MIN}, max {MAX}
        </span>
        <GhostButton
          size="sm"
          onClick={add}
          disabled={value.length >= MAX}
          icon={<Plus size={13} />}
        >
          Add project
        </GhostButton>
      </div>

      <div className="space-y-4">
        {value.map((p, idx) => (
          <div key={p.id} className="rounded-md border border-border-default bg-surface-2 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[12px] font-semibold text-text-subtle uppercase tracking-wider">
                Project {idx + 1}
              </p>
              {value.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="text-text-subtle hover:text-status-danger"
                  aria-label="Remove project"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            <div className="space-y-3">
              <FormField label="Title" required>
                <Input
                  value={p.title}
                  onChange={(e) => update(idx, { title: e.target.value })}
                  placeholder="e.g. Recipe Finder Web App"
                />
              </FormField>

              <FormField label="Description" required>
                <Textarea
                  rows={3}
                  value={p.description}
                  onChange={(e) => update(idx, { description: e.target.value })}
                  placeholder="What it does and what you built."
                />
              </FormField>

              <FormField label="Technologies" hint="Comma-separated, e.g. React, Node.js, MongoDB">
                <Input
                  value={p.technologies.join(", ")}
                  onChange={(e) =>
                    update(idx, {
                      technologies: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="GitHub URL">
                  <Input
                    value={p.githubUrl ?? ""}
                    onChange={(e) => update(idx, { githubUrl: e.target.value })}
                    placeholder="https://github.com/…"
                  />
                </FormField>
                <FormField label="Live URL">
                  <Input
                    value={p.liveUrl ?? ""}
                    onChange={(e) => update(idx, { liveUrl: e.target.value })}
                    placeholder="https://…"
                  />
                </FormField>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
