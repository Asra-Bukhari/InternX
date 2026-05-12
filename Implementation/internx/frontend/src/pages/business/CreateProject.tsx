import { useState } from "react";
import { useNavigate } from "react-router";
import { Send, AlertCircle, Plus, Trash2, Search } from "lucide-react";
import { PageShell } from "@/components/forms/PageShell";
import { Panel } from "@/components/forms/Panel";
import { FormField } from "@/components/forms/FormField";
import { PrimaryButton } from "@/components/forms/PrimaryButton";
import { GhostButton } from "@/components/forms/GhostButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SkillChip } from "@/components/data-display/SkillChip";
import { DifficultyTag } from "@/components/data-display/DifficultyTag";
import { SectionHeader } from "@/components/domain/SectionHeader";
import { projectsApi } from "@/lib/api/projects";
import { ApiError } from "@/lib/api/client";
import { SKILL_CATEGORIES, MAX_SKILL_CATEGORIES } from "@/lib/constants/skills";
import type { Difficulty, ContractType, ProjectDeliverable } from "@/types/project";
import { cn } from "@/lib/utils/cn";

const DIFFS: Difficulty[] = ["easy", "medium", "hard"];
const CONTRACTS: ContractType[] = ["fixed", "hourly"];

const CATEGORIES = [
  "Web Development",
  "Mobile Development",
  "Data / AI",
  "Design / UX",
  "Marketing",
  "Content / Writing",
  "DevOps / Infrastructure",
  "Other",
];

const DURATIONS = ["1 week", "2 weeks", "1 month", "2 months", "3 months", "6+ months"];
const HOURS_PER_DAY = ["2-4 hrs/day", "4-6 hrs/day", "6+ hrs/day"];

const MIN_TAGS = 3;
const MAX_TAGS = 6;
const MIN_DESC_WORDS = 300;
const MAX_DESC_WORDS = 500;
const MIN_DELIVERABLES = 1;
const MAX_DELIVERABLES = 10;

interface DeliverableDraft {
  id: string;
  title: string;
  description: string;
  deadline: string;
  paymentPercent: string;
}

function blankDeliverable(): DeliverableDraft {
  return { id: `d-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, title: "", description: "", deadline: "", paymentPercent: "" };
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function BusinessCreateProject() {
  const navigate = useNavigate();

  // Section 1
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("");
  const [contract, setContract] = useState<ContractType>("fixed");

  // Section 2
  const [tags, setTags] = useState<string[]>([]);
  const [openCat, setOpenCat] = useState<string | null>(null);

  // Section 3
  const [description, setDescription] = useState("");

  // Section 4
  const [duration, setDuration] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("");

  // Section 5
  const [budget, setBudget] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");

  // Section 6
  const [deliverables, setDeliverables] = useState<DeliverableDraft[]>([blankDeliverable()]);

  // Section 7
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wc = wordCount(description);

  const activeCats = SKILL_CATEGORIES
    .filter((c) => c.skills.some((s) => tags.includes(s)))
    .map((c) => c.name);

  function toggleTag(t: string, catName: string) {
    if (tags.includes(t)) {
      setTags(tags.filter((x) => x !== t));
      return;
    }
    if (tags.length >= MAX_TAGS) return;
    if (!activeCats.includes(catName) && activeCats.length >= MAX_SKILL_CATEGORIES) return;
    setTags([...tags, t]);
  }

  function patchDel(idx: number, p: Partial<DeliverableDraft>) {
    setDeliverables((cur) => cur.map((d, i) => (i === idx ? { ...d, ...p } : d)));
  }
  function addDel() {
    if (deliverables.length >= MAX_DELIVERABLES) return;
    setDeliverables([...deliverables, blankDeliverable()]);
  }
  function removeDel(idx: number) {
    if (deliverables.length <= MIN_DELIVERABLES) return;
    setDeliverables(deliverables.filter((_, i) => i !== idx));
  }

  function validate(): string | null {
    if (!title.trim()) return "Title is required.";
    if (!summary.trim()) return "Short summary is required.";
    if (!category) return "Select a category.";
    if (tags.length < MIN_TAGS) return `Select at least ${MIN_TAGS} technology tags.`;
    if (tags.length > MAX_TAGS) return `Maximum ${MAX_TAGS} technology tags allowed.`;
    if (wc < MIN_DESC_WORDS) return `Description must be at least ${MIN_DESC_WORDS} words (currently ${wc}).`;
    if (wc > MAX_DESC_WORDS) return `Description must be at most ${MAX_DESC_WORDS} words (currently ${wc}).`;
    if (!duration) return "Select a duration.";
    if (!hoursPerDay) return "Select hours per day.";
    if (!budget.trim()) return "Total budget is required.";
    if (Number.isNaN(Number(budget))) return "Budget must be a number.";
    const validDel = deliverables.filter((d) => d.title.trim());
    if (validDel.length < MIN_DELIVERABLES) return "Add at least 1 deliverable.";
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setSubmitting(true);
    try {
      const cleanedDeliverables: ProjectDeliverable[] = deliverables
        .filter((d) => d.title.trim())
        .map((d) => ({
          title: d.title.trim(),
          description: d.description.trim(),
          deadline: d.deadline,
          paymentPercent: d.paymentPercent ? Number(d.paymentPercent) : 0,
        }));

      await projectsApi.create({
        title: title.trim(),
        summary: summary.trim(),
        description: description.trim(),
        category,
        skillsRequired: tags,
        difficulty,
        contractType: contract,
        durationLabel: duration,
        hoursPerDay,
        budget: Number(budget),
        paymentNotes: paymentNotes.trim() || undefined,
        deliverables: cleanedDeliverables,
      });
      navigate("/dashboard/business/projects");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create project.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell
      title="Create New Project"
      subtitle="Define the brief. We cap at 10 applicants per project."
      actions={
        <>
          <GhostButton size="md" onClick={() => navigate(-1)} disabled={submitting}>Cancel</GhostButton>
          <PrimaryButton size="md" onClick={onSubmit} icon={<Send size={14} />} disabled={submitting}>
            {submitting ? "Publishing…" : "Publish"}
          </PrimaryButton>
        </>
      }
    >
      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-md border border-status-danger/30 bg-status-danger-soft px-3 py-2.5 text-[12.5px] text-status-danger">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Section 1 — Basic */}
        <Panel padding="p-6">
          <SectionHeader title="Basic Information" />
          <div className="space-y-4">
            <FormField label="Project title" required>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="E.g. Marketing Analytics Dashboard" />
            </FormField>
            <FormField label="Short summary" hint="One-line teaser shown on project cards" required>
              <Input value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Build a real-time analytics dashboard for our marketing team." />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Category" required>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Project type" required>
                <div className="grid grid-cols-2 gap-2">
                  {CONTRACTS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setContract(c)}
                      className={cn(
                        "rounded-md border px-3 py-2 text-[13px] capitalize transition-colors",
                        contract === c
                          ? "border-brand/40 bg-brand/10 text-brand"
                          : "border-border-default bg-surface-2 text-text hover:border-border-strong",
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </FormField>
            </div>
          </div>
        </Panel>

        {/* Section 2 — Tags */}
        <Panel padding="p-6">
          <SectionHeader
            title="Technologies & Tags"
            description={`Select ${MIN_TAGS}–${MAX_TAGS} tags from max ${MAX_SKILL_CATEGORIES} categories · ${tags.length} selected`}
          />
          {tags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5 rounded-md border border-border-default bg-surface-2 p-3">
              {tags.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTag(t, SKILL_CATEGORIES.find((c) => c.skills.includes(t as never))?.name ?? "")}
                  className="inline-flex items-center gap-1 rounded-md bg-brand/15 px-2 py-1 text-[12px] font-medium text-brand"
                >
                  {t} <Trash2 size={10} />
                </button>
              ))}
            </div>
          )}
          <div className="space-y-1">
            {SKILL_CATEGORIES.map((cat) => {
              const isOpen = openCat === cat.name;
              const catActive = activeCats.includes(cat.name);
              const catBlocked = !catActive && activeCats.length >= MAX_SKILL_CATEGORIES;
              return (
                <div key={cat.name} className="rounded-md border border-border-default overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenCat(isOpen ? null : cat.name)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-2.5 text-[13px] font-medium text-left",
                      catActive ? "bg-brand/10 text-brand" : "bg-surface-2 text-text",
                      catBlocked && "opacity-40 cursor-not-allowed",
                    )}
                  >
                    <span>{cat.name}{catActive ? ` (${cat.skills.filter((s) => tags.includes(s)).length})` : ""}</span>
                    <Search size={13} className={cn("transition-transform", isOpen && "rotate-90")} />
                  </button>
                  {isOpen && (
                    <div className="px-4 py-3 bg-surface-1 flex flex-wrap gap-1.5">
                      {cat.skills.map((s) => {
                        const selected = tags.includes(s);
                        const blocked = !selected && (tags.length >= MAX_TAGS || catBlocked);
                        return (
                          <button
                            key={s}
                            type="button"
                            disabled={blocked}
                            onClick={() => toggleTag(s, cat.name)}
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
        </Panel>

        {/* Section 3 — Description */}
        <Panel padding="p-6">
          <SectionHeader
            title="Project Details"
            description={`Full description · ${MIN_DESC_WORDS}–${MAX_DESC_WORDS} words · currently ${wc}`}
          />
          <Textarea
            rows={12}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the project in detail: goals, scope, what success looks like, technical requirements, constraints…"
          />
          <p
            className={cn(
              "mt-2 text-[11.5px]",
              wc < MIN_DESC_WORDS || wc > MAX_DESC_WORDS ? "text-status-danger" : "text-status-success",
            )}
          >
            {wc < MIN_DESC_WORDS
              ? `Need at least ${MIN_DESC_WORDS - wc} more words.`
              : wc > MAX_DESC_WORDS
              ? `Trim ${wc - MAX_DESC_WORDS} words.`
              : "Word count OK."}
          </p>
        </Panel>

        {/* Section 4 — Time */}
        <Panel padding="p-6">
          <SectionHeader title="Time Requirements" />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Estimated duration" required>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger><SelectValue placeholder="Select duration" /></SelectTrigger>
                <SelectContent>
                  {DURATIONS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Hours required per day" required>
              <Select value={hoursPerDay} onValueChange={setHoursPerDay}>
                <SelectTrigger><SelectValue placeholder="Select hours/day" /></SelectTrigger>
                <SelectContent>
                  {HOURS_PER_DAY.map((h) => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                </SelectContent>
              </Select>
            </FormField>
          </div>
        </Panel>

        {/* Section 5 — Budget */}
        <Panel padding="p-6">
          <SectionHeader title="Budget" />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Total project budget (USD)" required>
              <Input
                type="text"
                inputMode="numeric"
                value={budget}
                onChange={(e) => setBudget(e.target.value.replace(/[^\d]/g, ""))}
                placeholder="1500"
              />
            </FormField>
            <FormField label="Payment notes (optional)" hint="Breakdown or terms">
              <Input value={paymentNotes} onChange={(e) => setPaymentNotes(e.target.value)} placeholder="50% milestone, 50% on approval" />
            </FormField>
          </div>
        </Panel>

        {/* Section 6 — Deliverables */}
        <Panel padding="p-6">
          <SectionHeader
            title="Deliverables"
            description={`At least ${MIN_DELIVERABLES}, max ${MAX_DELIVERABLES}`}
            action={
              <GhostButton
                size="sm"
                onClick={addDel}
                disabled={deliverables.length >= MAX_DELIVERABLES}
                icon={<Plus size={13} />}
              >
                Add deliverable
              </GhostButton>
            }
          />
          <div className="space-y-3">
            {deliverables.map((d, i) => (
              <div key={d.id} className="rounded-md border border-border-default bg-surface-2 p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[12px] font-semibold text-text-subtle uppercase tracking-wider">
                    Deliverable {i + 1}
                  </p>
                  {deliverables.length > MIN_DELIVERABLES && (
                    <button type="button" onClick={() => removeDel(i)} className="text-text-subtle hover:text-status-danger">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <FormField label="Title" required>
                    <Input value={d.title} onChange={(e) => patchDel(i, { title: e.target.value })} placeholder="E.g. Wireframes" />
                  </FormField>
                  <FormField label="Description">
                    <Textarea rows={2} value={d.description} onChange={(e) => patchDel(i, { description: e.target.value })} />
                  </FormField>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Deadline">
                      <Input type="date" value={d.deadline} onChange={(e) => patchDel(i, { deadline: e.target.value })} />
                    </FormField>
                    <FormField label="Payment %" hint="Of total budget (0–100)">
                      <Input
                        inputMode="numeric"
                        value={d.paymentPercent}
                        onChange={(e) => patchDel(i, { paymentPercent: e.target.value.replace(/[^\d]/g, "") })}
                        placeholder="e.g. 25"
                      />
                    </FormField>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Section 7 — Difficulty */}
        <Panel padding="p-6">
          <SectionHeader title="Difficulty" />
          <div className="grid grid-cols-3 gap-2">
            {DIFFS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                className={cn(
                  "flex items-center justify-between rounded-md border px-3 py-2 text-left transition-colors",
                  difficulty === d
                    ? "border-brand/40 bg-brand/10"
                    : "border-border-default bg-surface-2 hover:border-border-strong",
                )}
              >
                <span className="text-[13px] text-text capitalize">{d}</span>
                <DifficultyTag level={d} />
              </button>
            ))}
          </div>
        </Panel>

        <div className="flex justify-end gap-2">
          <GhostButton size="lg" onClick={() => navigate(-1)} disabled={submitting}>Cancel</GhostButton>
          <PrimaryButton size="lg" onClick={onSubmit} icon={<Send size={15} />} disabled={submitting}>
            {submitting ? "Publishing…" : "Publish Project"}
          </PrimaryButton>
        </div>
      </form>
    </PageShell>
  );
}
