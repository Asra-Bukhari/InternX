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
  const progress = uiProgress(project);
  const totalDel = project.deliverables?.length ?? 0;

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Project details */}
        <Panel padding="p-6">
          <h2 className="text-[16px] font-semibold text-text mb-4">Project Details</h2>
          <div className="grid sm:grid-cols-2 gap-6 text-[13px]">
            <div>
              <p className="text-text-subtle">Status</p>
              <div className="mt-2"><StatusTag label={uiStatusLabel(project)} variant={statusVariant(project.status)} /></div>
            </div>
            <div>
              <p className="text-text-subtle">Difficulty</p>
              <div className="mt-2"><DifficultyTag level={project.difficulty} /></div>
            </div>
            <div>
              <p className="text-text-subtle">Contract Type</p>
              <p className="mt-2 text-text font-medium">{CONTRACT_LABEL[project.contractType]}</p>
            </div>
            <div>
              <p className="text-text-subtle">Budget</p>
              <p className="mt-2 text-text font-medium">{project.budget ? `$${project.budget.toLocaleString()}` : "—"}</p>
            </div>
            <div>
              <p className="text-text-subtle">Duration</p>
              <p className="mt-2 text-text font-medium">{project.durationLabel || "—"}</p>
            </div>
            <div>
              <p className="text-text-subtle">Hours / day</p>
              <p className="mt-2 text-text font-medium">{project.hoursPerDay || "—"}</p>
            </div>
            <div>
              <p className="text-text-subtle">Category</p>
              <p className="mt-2 text-text font-medium">{project.category || "—"}</p>
            </div>
            <div>
              <p className="text-text-subtle">Applicants</p>
              <p className="mt-2 text-text font-medium">{applicantsCount(project)}</p>
            </div>
          </div>
        </Panel>

        {/* Progress tracking */}
        <Panel padding="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-semibold text-text">Overall Progress</h3>
            <span className="text-[24px] font-bold text-brand">{progress}%</span>
          </div>
          <ProgressBar value={progress} />
          <div className="mt-3 grid sm:grid-cols-3 gap-3 text-[12px]">
            <div className="text-center">
              <p className="text-text-subtle">Deliverables</p>
              <p className="text-text font-semibold mt-1">{totalDel}</p>
            </div>
            <div className="text-center">
              <p className="text-text-subtle">Completion</p>
              <p className="text-text font-semibold mt-1">{progress}%</p>
            </div>
            <div className="text-center">
              <p className="text-text-subtle">Paid</p>
              <p className="text-status-success font-semibold mt-1">$0</p>
            </div>
          </div>
        </Panel>

        {/* Description */}
        <Panel padding="p-6">
          <h3 className="text-[14px] font-semibold text-text mb-3">Description</h3>
          <p className="text-[13px] text-text-muted leading-relaxed whitespace-pre-line">{project.description}</p>
        </Panel>

        {/* Skills required */}
        {project.skillsRequired && project.skillsRequired.length > 0 && (
          <Panel padding="p-6">
            <h3 className="text-[14px] font-semibold text-text mb-3">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {project.skillsRequired.map((s) => (
                <span key={s} className="rounded-md bg-surface-3 px-3 py-1.5 text-[12px] text-text-muted font-medium">
                  {s}
                </span>
              ))}
            </div>
          </Panel>
        )}

        {/* Deliverables overview */}
        {totalDel > 0 && (
          <Panel padding="p-6">
            <h3 className="text-[14px] font-semibold text-text mb-4">Deliverables</h3>
            <div className="space-y-2">
              {project.deliverables!.map((d, i) => (
                <div
                  key={d._id ?? i}
                  className="flex items-start justify-between gap-3 rounded-lg border border-border-subtle bg-surface-2 px-4 py-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-text">{d.title}</p>
                    {d.description && (
                      <p className="text-[12px] text-text-muted mt-0.5 leading-relaxed">{d.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 text-right">
                    {d.deadline && (
                      <span className="text-[11px] text-text-subtle">Due {d.deadline}</span>
                    )}
                    {d.paymentPercent && (
                      <span className="text-[11.5px] font-medium text-text">{d.paymentPercent}%</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        {/* Hired student */}
        <Panel padding="p-5">
          <h3 className="text-[14px] font-semibold text-text mb-4">Hired Student</h3>
          {selectedStudentName ? (
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-brand/15 text-[14px] font-semibold text-brand flex-shrink-0">
                {selectedStudentName.split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-text truncate">{selectedStudentName}</p>
                <p className="text-[11.5px] text-text-subtle">Assigned to project</p>
              </div>
            </div>
          ) : (
            <p className="text-[12.5px] text-text-subtle">
              No student selected yet. Review applicants to choose one.
            </p>
          )}
        </Panel>

        {/* Quick stats */}
        <Panel padding="p-5">
          <h3 className="text-[14px] font-semibold text-text mb-3">Stats</h3>
          <div className="space-y-2.5 text-[12px]">
            <div className="flex justify-between">
              <span className="text-text-subtle">Budget</span>
              <span className="text-text font-medium">${project.budget?.toLocaleString() ?? "0"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-subtle">Deliverables</span>
              <span className="text-text font-medium">{totalDel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-subtle">Progress</span>
              <span className="text-brand font-medium">{progress}%</span>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
