import { useState } from "react";
import { useNavigate } from "react-router";
import { Send } from "lucide-react";
import { PageShell } from "@/components/forms/PageShell";
import { Panel } from "@/components/forms/Panel";
import { FormField } from "@/components/forms/FormField";
import { PrimaryButton } from "@/components/forms/PrimaryButton";
import { GhostButton } from "@/components/forms/GhostButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SkillChip } from "@/components/data-display/SkillChip";
import { DifficultyTag } from "@/components/data-display/DifficultyTag";
import { SectionHeader } from "@/components/domain/SectionHeader";
import { SKILLS } from "@/lib/mock/student";
import type { Difficulty, ContractType } from "@/types/project";

const DIFFS: Difficulty[] = ["Basic", "Medium", "Hard", "Hardcore"];

export default function BusinessCreateProject() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    skills: [] as string[],
    difficulty: "Medium" as Difficulty,
    contract: "Fixed" as ContractType,
    deadline: "",
    budget: "",
  });

  function update<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }
  function toggleSkill(s: string) {
    update("skills", form.skills.includes(s) ? form.skills.filter((x) => x !== s) : [...form.skills, s]);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Mock — Phase 6 will POST to /api/projects
    navigate("/dashboard/business/projects");
  }

  return (
    <PageShell
      title="Create New Project"
      subtitle="Define the brief. We cap at 10 applicants per project."
      actions={
        <>
          <GhostButton size="md" onClick={() => navigate(-1)}>Cancel</GhostButton>
          <PrimaryButton size="md" onClick={onSubmit} icon={<Send size={14} />}>Publish</PrimaryButton>
        </>
      }
    >
      <form onSubmit={onSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <Panel padding="p-6">
            <SectionHeader title="Project basics" />
            <div className="space-y-4">
              <FormField label="Title" required>
                <Input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="E.g. Marketing Analytics Dashboard" required />
              </FormField>
              <FormField label="Description" hint="Markdown supported. Be specific about scope." required>
                <Textarea
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="What needs to be built and why?"
                  rows={6}
                  required
                />
              </FormField>
            </div>
          </Panel>

          <Panel padding="p-6">
            <SectionHeader title="Required skills" description="Select up to 8 skills" />
            <div className="flex flex-wrap gap-1.5">
              {SKILLS.map((s) => (
                <SkillChip key={s} label={s} active={form.skills.includes(s)} onClick={() => toggleSkill(s)} />
              ))}
            </div>
          </Panel>
        </div>

        <aside className="space-y-5">
          <Panel padding="p-6">
            <SectionHeader title="Difficulty" />
            <div className="space-y-2">
              {DIFFS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => update("difficulty", d)}
                  className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-left transition-colors ${
                    form.difficulty === d
                      ? "border-brand/40 bg-brand/10"
                      : "border-border-default bg-surface-2 hover:border-border-strong"
                  }`}
                >
                  <span className="text-[13px] text-text">{d}</span>
                  <DifficultyTag level={d} />
                </button>
              ))}
            </div>
          </Panel>

          <Panel padding="p-6">
            <SectionHeader title="Contract" />
            <div className="grid grid-cols-2 gap-2">
              {(["Fixed", "Hourly"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => update("contract", c)}
                  className={`rounded-md border px-3 py-2 text-[13px] transition-colors ${
                    form.contract === c
                      ? "border-brand/40 bg-brand/10 text-brand"
                      : "border-border-default bg-surface-2 text-text hover:border-border-strong"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </Panel>

          <Panel padding="p-6">
            <SectionHeader title="Timeline & budget" />
            <div className="space-y-4">
              <FormField label="Deadline" required>
                <Input type="date" value={form.deadline} onChange={(e) => update("deadline", e.target.value)} required />
              </FormField>
              <FormField label="Budget" hint={form.contract === "Hourly" ? "Per hour" : "Total"} required>
                <Input value={form.budget} onChange={(e) => update("budget", e.target.value)} placeholder={form.contract === "Hourly" ? "$25/hr" : "$1,500"} required />
              </FormField>
            </div>
          </Panel>
        </aside>
      </form>
    </PageShell>
  );
}
