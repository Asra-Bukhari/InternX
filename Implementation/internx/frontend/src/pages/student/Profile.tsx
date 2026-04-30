import { Mail, GraduationCap, Calendar, Star } from "lucide-react";
import { PageShell } from "@/components/forms/PageShell";
import { Panel } from "@/components/forms/Panel";
import { SkillChip } from "@/components/data-display/SkillChip";
import { GhostButton } from "@/components/forms/GhostButton";
import { PrimaryButton } from "@/components/forms/PrimaryButton";
import { STUDENT, STUDENT_SKILLS, APPLICATIONS } from "@/lib/mock/student";

export default function StudentProfile() {
  return (
    <PageShell
      title="Profile"
      subtitle="Manage your public profile and preferences"
      actions={<><GhostButton size="md">Cancel</GhostButton><PrimaryButton size="md">Save changes</PrimaryButton></>}
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <Panel padding="p-6" className="lg:col-span-1">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-brand/15 text-[20px] font-semibold text-brand">
              {STUDENT.initials}
            </div>
            <div>
              <h2 className="text-[18px] font-semibold text-text">{STUDENT.name}</h2>
              <p className="text-[12.5px] text-brand">{STUDENT.level}</p>
            </div>
          </div>
          <div className="mt-6 space-y-3 text-[13px]">
            <div className="flex items-center gap-2 text-text-muted"><Mail size={13}/> {STUDENT.email}</div>
            <div className="flex items-center gap-2 text-text-muted"><GraduationCap size={13}/> {STUDENT.university}</div>
            <div className="flex items-center gap-2 text-text-muted"><Calendar size={13}/> Class of {STUDENT.graduation}</div>
            <div className="flex items-center gap-2 text-text-muted"><Star size={13} className="text-status-warning fill-status-warning"/> {STUDENT.rating} rating</div>
          </div>
        </Panel>

        <Panel padding="p-6" className="lg:col-span-2">
          <h3 className="text-[15px] font-semibold text-text">Skills</h3>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {STUDENT_SKILLS.map((s) => <SkillChip key={s} label={s} active />)}
          </div>

          <h3 className="mt-7 text-[15px] font-semibold text-text">About</h3>
          <p className="mt-2 text-[13.5px] text-text-muted leading-relaxed">
            CS undergrad at {STUDENT.university} ({STUDENT.semester}). Focused on full-stack web and product
            design. Available for {STUDENT.completed > 3 ? "Medium and Hard" : "Basic and Medium"} projects.
          </p>

          <h3 className="mt-7 text-[15px] font-semibold text-text">Recent activity</h3>
          <ul className="mt-3 space-y-2 text-[13px]">
            {APPLICATIONS.slice(0, 3).map((a) => (
              <li key={a.id} className="flex justify-between text-text-muted">
                <span>Applied to <span className="text-text">{a.projectTitle}</span></span>
                <span className="text-text-subtle">{a.appliedAt}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </PageShell>
  );
}
