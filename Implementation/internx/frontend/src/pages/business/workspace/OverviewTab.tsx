import { Panel } from "@/components/forms/Panel";
import { ProgressBar } from "@/components/data-display/ProgressBar";
import { DifficultyTag } from "@/components/data-display/DifficultyTag";
import { StatusTag, type StatusVariant } from "@/components/data-display/StatusTag";
import {
  type BackendProject,
  uiStatusLabel,
  uiProgress,
  applicantsCount,
  CONTRACT_LABEL,
} from "@/types/project";

interface Props {
  project: BackendProject;
  selectedStudentName?: string | null;
}

function statusVariant(s?: string): StatusVariant {
  if (!s) return "draft";
  if (s.includes("progress")) return "in-progress";
  if (s === "open") return "info";
  if (s.includes("complete")) return "completed";
  return "draft";
}

export function OverviewTab({ project, selectedStudentName }: Props) {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <Panel padding="p-6" className="lg:col-span-2">
        <h2 className="text-[16px] font-semibold text-text">Project</h2>
        <div className="mt-4 grid grid-cols-2 gap-y-4 text-[13px]">
          <div>
            <p className="text-text-subtle">Difficulty</p>
            <div className="mt-1"><DifficultyTag level={project.difficulty} /></div>
          </div>
          <div>
            <p className="text-text-subtle">Contract</p>
            <p className="mt-1 text-text font-medium">{CONTRACT_LABEL[project.contractType]}</p>
          </div>
          <div>
            <p className="text-text-subtle">Status</p>
            <div className="mt-1"><StatusTag label={uiStatusLabel(project)} variant={statusVariant(project.status)} /></div>
          </div>
          <div>
            <p className="text-text-subtle">Applicants</p>
            <p className="mt-1 text-text font-medium">{applicantsCount(project)} / 10</p>
          </div>
          <div>
            <p className="text-text-subtle">Duration</p>
            <p className="mt-1 text-text font-medium">{project.durationLabel || "—"}</p>
          </div>
          <div>
            <p className="text-text-subtle">Hours / day</p>
            <p className="mt-1 text-text font-medium">{project.hoursPerDay || "—"}</p>
          </div>
          <div>
            <p className="text-text-subtle">Budget</p>
            <p className="mt-1 text-text font-medium">{project.budget ? `$${project.budget.toLocaleString()}` : "—"}</p>
          </div>
          <div>
            <p className="text-text-subtle">Category</p>
            <p className="mt-1 text-text font-medium">{project.category || "—"}</p>
          </div>
        </div>
        <div className="mt-6">
          <div className="flex justify-between text-[12px] text-text-subtle mb-1.5">
            <span>Progress</span><span>{uiProgress(project)}%</span>
          </div>
          <ProgressBar value={uiProgress(project)} />
        </div>
        <h3 className="mt-7 text-[14px] font-semibold text-text">Description</h3>
        <p className="mt-2 text-[13px] text-text-muted leading-relaxed whitespace-pre-line">{project.description}</p>
        {project.skillsRequired && project.skillsRequired.length > 0 && (
          <>
            <h3 className="mt-6 text-[14px] font-semibold text-text">Required skills</h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {project.skillsRequired.map((s) => (
                <span key={s} className="rounded-md bg-surface-3 px-2 py-0.5 text-[11.5px] text-text-muted">{s}</span>
              ))}
            </div>
          </>
        )}
        {project.deliverables && project.deliverables.length > 0 && (
          <>
            <h3 className="mt-6 text-[14px] font-semibold text-text">Deliverables</h3>
            <ul className="mt-2 space-y-2">
              {project.deliverables.map((d, i) => (
                <li key={d._id ?? i} className="rounded-md border border-border-subtle bg-surface-2 px-3 py-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[13px] font-medium text-text">{d.title}</p>
                    {d.paymentPercent ? (
                      <span className="text-[11.5px] text-text-subtle">{d.paymentPercent}%</span>
                    ) : null}
                  </div>
                  {d.description && <p className="text-[12px] text-text-muted mt-0.5 leading-relaxed">{d.description}</p>}
                  {d.deadline && <p className="text-[11px] text-text-subtle mt-1">Due {d.deadline}</p>}
                </li>
              ))}
            </ul>
          </>
        )}
      </Panel>

      <Panel padding="p-5">
        <h3 className="text-[14px] font-semibold text-text">Hired Student</h3>
        {selectedStudentName ? (
          <div className="mt-4 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-brand/15 text-[14px] font-semibold text-brand">
              {selectedStudentName.split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase()}
            </div>
            <div>
              <p className="text-[14px] font-semibold text-text">{selectedStudentName}</p>
              <p className="text-[11.5px] text-text-subtle">Selected for project</p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-[12.5px] text-text-subtle">
            No student selected yet. Review applicants to choose one.
          </p>
        )}
      </Panel>
    </div>
  );
}
