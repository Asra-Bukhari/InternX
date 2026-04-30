import { Award, Lock, CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/forms/PageShell";
import { Panel } from "@/components/forms/Panel";
import { ProgressBar } from "@/components/data-display/ProgressBar";
import { LEVELS, STUDENT } from "@/lib/mock/student";
import { cn } from "@/lib/utils/cn";

export default function StudentLevels() {
  const currentIndex = STUDENT.levelIndex;
  const completed = STUDENT.completed;

  return (
    <PageShell title="Levels" subtitle="Complete more projects to unlock new tiers, perks, and pay rates.">
      <Panel padding="p-6" className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-md bg-brand/15 text-brand">
              <Award size={20} />
            </div>
            <div>
              <p className="text-[12px] text-text-subtle uppercase tracking-wider">Current level</p>
              <p className="text-[20px] font-bold text-text">{LEVELS[currentIndex].name}</p>
            </div>
          </div>
          <div className="flex-1 min-w-[260px]">
            <div className="flex justify-between text-[11.5px] text-text-subtle mb-1.5">
              <span>{completed} projects completed</span>
              <span>2 to next tier</span>
            </div>
            <ProgressBar value={70} />
          </div>
        </div>
      </Panel>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
        {LEVELS.map((lvl, i) => {
          const status = i < currentIndex ? "completed" : i === currentIndex ? "current" : "locked";
          return (
            <Panel key={lvl.name} padding="p-6" className={cn(
              "relative",
              status === "current" && "border-brand/40",
            )}>
              {status === "completed" && (
                <div className="absolute right-4 top-4 grid h-7 w-7 place-items-center rounded-full bg-status-success-soft text-status-success">
                  <CheckCircle2 size={14}/>
                </div>
              )}
              {status === "locked" && (
                <div className="absolute right-4 top-4 grid h-7 w-7 place-items-center rounded-full bg-surface-3 text-text-subtle">
                  <Lock size={13}/>
                </div>
              )}
              {status === "current" && (
                <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-md bg-brand/15 px-2 py-0.5 text-[10.5px] font-semibold text-brand">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" /> CURRENT
                </span>
              )}
              <div className="grid h-10 w-10 place-items-center rounded-md bg-brand/15 text-brand">
                <Award size={18} />
              </div>
              <h3 className="mt-4 text-[16px] font-semibold text-text">{lvl.name}</h3>
              <p className="mt-1 text-[12px] text-text-subtle">{lvl.range}</p>
              <p className="mt-3 text-[12.5px] text-text-muted leading-relaxed">{lvl.description}</p>
              <ul className="mt-4 space-y-1.5">
                {lvl.perks.map((p) => (
                  <li key={p} className="flex items-start gap-1.5 text-[12px] text-text-muted">
                    <span className="mt-1 h-1 w-1 rounded-full bg-brand flex-shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </Panel>
          );
        })}
      </div>
    </PageShell>
  );
}
