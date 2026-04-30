import { Panel } from "@/components/forms/Panel";
import { ProgressBar } from "@/components/data-display/ProgressBar";
import { DifficultyTag } from "@/components/data-display/DifficultyTag";
import { StatusTag } from "@/components/data-display/StatusTag";
import { WORKSPACE_PROJECT } from "@/lib/mock/business";

export function OverviewTab() {
  const p = WORKSPACE_PROJECT;
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <Panel padding="p-6" className="lg:col-span-2">
        <h2 className="text-[16px] font-semibold text-text">Project</h2>
        <div className="mt-4 grid grid-cols-2 gap-y-4 text-[13px]">
          <div><p className="text-text-subtle">Difficulty</p><div className="mt-1"><DifficultyTag level={p.difficulty} /></div></div>
          <div><p className="text-text-subtle">Contract</p><p className="mt-1 text-text font-medium">{p.contractType}</p></div>
          <div><p className="text-text-subtle">Budget</p><p className="mt-1 text-text font-medium">{p.budget}</p></div>
          <div><p className="text-text-subtle">Deadline</p><p className="mt-1 text-text font-medium">{p.deadline}</p></div>
          <div><p className="text-text-subtle">Status</p><div className="mt-1"><StatusTag label={p.status} variant="in-progress" /></div></div>
        </div>
        <div className="mt-6">
          <div className="flex justify-between text-[12px] text-text-subtle mb-1.5">
            <span>Progress</span><span>{p.progress}%</span>
          </div>
          <ProgressBar value={p.progress} />
        </div>
      </Panel>

      <Panel padding="p-5">
        <h3 className="text-[14px] font-semibold text-text">Hired Student</h3>
        <div className="mt-4 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-brand/15 text-[14px] font-semibold text-brand">
            {p.student.initials}
          </div>
          <div>
            <p className="text-[14px] font-semibold text-text">{p.student.name}</p>
            <p className="text-[11.5px] text-text-subtle">{p.student.university}</p>
            <p className="text-[11px] text-brand mt-0.5">{p.student.level}</p>
          </div>
        </div>
      </Panel>
    </div>
  );
}
