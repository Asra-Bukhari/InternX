import { FormField } from "@/components/forms/FormField";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AvailabilityExtended, AvailabilityHours } from "@/types/profile";
import { cn } from "@/lib/utils/cn";

interface Props {
  value: AvailabilityExtended;
  onChange: (next: AvailabilityExtended) => void;
}

type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

const DAYS: { key: DayKey; label: string }[] = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
  { key: "sun", label: "Sun" },
];

export function AvailabilityEditor({ value, onChange }: Props) {
  function patch(p: Partial<AvailabilityExtended>) {
    onChange({ ...value, ...p });
  }

  function toggleDay(d: DayKey) {
    const cur = value.unavailableDays ?? [];
    patch({
      unavailableDays: cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d],
    });
  }

  return (
    <div className="space-y-5">
      <FormField label="Hours available per day" required>
        <Select
          value={value.hoursPerDay ?? ""}
          onValueChange={(v) => patch({ hoursPerDay: v as AvailabilityHours })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2-4">2–4 hours</SelectItem>
            <SelectItem value="4-6">4–6 hours</SelectItem>
            <SelectItem value="6+">6+ hours</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      <div>
        <label className="text-[12.5px] font-medium text-text-dim">Preferred working time range</label>
        <div className="grid grid-cols-2 gap-3 mt-1.5">
          <div>
            <p className="text-[11px] text-text-subtle mb-1">From</p>
            <Input
              type="time"
              value={value.startTime ?? ""}
              onChange={(e) => patch({ startTime: e.target.value })}
            />
          </div>
          <div>
            <p className="text-[11px] text-text-subtle mb-1">To</p>
            <Input
              type="time"
              value={value.endTime ?? ""}
              onChange={(e) => patch({ endTime: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div>
        <label className="text-[12.5px] font-medium text-text-dim">Days you're typically unavailable</label>
        <p className="text-[11.5px] text-text-subtle mt-0.5 mb-2">Click any day to mark it as busy.</p>
        <div className="flex flex-wrap gap-1.5">
          {DAYS.map((d) => {
            const off = (value.unavailableDays ?? []).includes(d.key);
            return (
              <button
                key={d.key}
                type="button"
                onClick={() => toggleDay(d.key)}
                className={cn(
                  "h-9 w-12 rounded-md border text-[12.5px] font-medium transition-colors",
                  off
                    ? "border-status-danger/30 bg-status-danger-soft text-status-danger"
                    : "border-border-default bg-surface-2 text-text-muted hover:bg-surface-3 hover:text-text",
                )}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-[12.5px] font-medium text-text-dim">Exam period (optional)</label>
        <p className="text-[11.5px] text-text-subtle mt-0.5 mb-2">Mark a window when you'll be unavailable.</p>
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="date"
            value={value.examPeriodStart ?? ""}
            onChange={(e) => patch({ examPeriodStart: e.target.value })}
          />
          <Input
            type="date"
            value={value.examPeriodEnd ?? ""}
            onChange={(e) => patch({ examPeriodEnd: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
