import { useState } from "react";
import { Link } from "react-router";
import { Mail, GraduationCap, Calendar, Star, MapPin, Edit3, Github, ExternalLink, Sparkles } from "lucide-react";
import { PageShell } from "@/components/forms/PageShell";
import { Panel } from "@/components/forms/Panel";
import { SkillChip } from "@/components/data-display/SkillChip";
import { GhostButton } from "@/components/forms/GhostButton";
import { PrimaryButton } from "@/components/forms/PrimaryButton";
import { OnboardingBanner } from "@/components/feedback/OnboardingBanner";
import { SkillBadgeModal } from "@/components/domain/SkillBadgeModal";
import { useAuth } from "@/lib/auth/useAuth";
import { levelForCount } from "@/lib/constants/levels";

export default function StudentProfile() {
  const { user, profile } = useAuth();
  const [badgeModalOpen, setBadgeModalOpen] = useState(false);

  if (!user) return null;

  const ext = profile?.ext ?? {};
  const skills = profile?.skills ?? [];
  const completed = profile?.completedProjects ?? 0;
  const rating = profile?.rating ?? 0;
  const { level } = levelForCount(completed);

  const initials = user.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  return (
    <PageShell
      title="Profile"
      subtitle="Your public profile"
      actions={
        <Link to="/dashboard/student/profile/setup">
          <GhostButton size="md" icon={<Edit3 size={14} />}>Edit profile</GhostButton>
        </Link>
      }
    >
      <OnboardingBanner />

      <div className="grid lg:grid-cols-3 gap-6">
        <Panel padding="p-6" className="lg:col-span-1">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-brand/15 text-[20px] font-semibold text-brand">
              {initials}
            </div>
            <div>
              <h2 className="text-[18px] font-semibold text-text">{user.name}</h2>
              <p className="text-[12.5px] text-brand">{level.name}</p>
              {ext.headline && <p className="text-[12px] text-text-subtle mt-0.5">{ext.headline}</p>}
            </div>
          </div>
          <div className="mt-6 space-y-3 text-[13px]">
            <div className="flex items-center gap-2 text-text-muted"><Mail size={13}/> {user.email}</div>
            {profile?.university && (
              <div className="flex items-center gap-2 text-text-muted"><GraduationCap size={13}/> {profile.university}</div>
            )}
            {ext._graduationYear && (
              <div className="flex items-center gap-2 text-text-muted"><Calendar size={13}/> Class of {ext._graduationYear}</div>
            )}
            {ext.location && (
              <div className="flex items-center gap-2 text-text-muted"><MapPin size={13}/> {ext.location}</div>
            )}
            <div className="flex items-center gap-2 text-text-muted">
              <Star size={13} className="text-status-warning fill-status-warning"/>
              {rating ? rating.toFixed(1) : "—"} rating · {completed} completed
            </div>
          </div>
        </Panel>

        <Panel padding="p-6" className="lg:col-span-2">
          {ext.bio && (
            <>
              <h3 className="text-[15px] font-semibold text-text">About</h3>
              <p className="mt-2 text-[13.5px] text-text-muted leading-relaxed whitespace-pre-line">{ext.bio}</p>
            </>
          )}

          <div className={`flex items-center justify-between ${ext.bio ? "mt-7" : ""}`}>
            <h3 className="text-[15px] font-semibold text-text">Skills</h3>
            <PrimaryButton
              size="sm"
              icon={<Sparkles size={13} />}
              onClick={() => setBadgeModalOpen(true)}
            >
              Add Skill Badge
            </PrimaryButton>
          </div>
          {skills.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {skills.map((s) => <SkillChip key={s} label={s} active />)}
            </div>
          ) : (
            <p className="mt-2 text-[12.5px] text-text-subtle">No skills added yet.</p>
          )}

          {(ext._degreeLevel || profile?.semester) && (
            <>
              <h3 className="mt-7 text-[15px] font-semibold text-text">Academic</h3>
              <div className="mt-2 grid grid-cols-2 gap-y-2 gap-x-6 text-[13px]">
                {ext._degreeLevel && (
                  <div><span className="text-text-subtle">Degree level:</span> <span className="text-text">{ext._degreeLevel}</span></div>
                )}
                {ext._degree && (
                  <div><span className="text-text-subtle">Program:</span> <span className="text-text">{ext._degree}</span></div>
                )}
                {profile?.semester && (
                  <div><span className="text-text-subtle">Semester:</span> <span className="text-text">{profile.semester}</span></div>
                )}
                {ext._cgpa && (
                  <div><span className="text-text-subtle">CGPA:</span> <span className="text-text">{ext._cgpa}</span></div>
                )}
              </div>
            </>
          )}

          {ext.portfolio && ext.portfolio.length > 0 && (
            <>
              <h3 className="mt-7 text-[15px] font-semibold text-text">Portfolio</h3>
              <div className="mt-3 grid sm:grid-cols-2 gap-3">
                {ext.portfolio.map((p) => (
                  <div key={p.id} className="rounded-md border border-border-default bg-surface-2 p-4">
                    <p className="text-[14px] font-semibold text-text">{p.title}</p>
                    <p className="text-[12.5px] text-text-muted mt-1 line-clamp-3">{p.description}</p>
                    {p.technologies.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {p.technologies.map((t) => (
                          <span key={t} className="rounded-md bg-surface-3 px-1.5 py-0.5 text-[10.5px] text-text-muted">{t}</span>
                        ))}
                      </div>
                    )}
                    <div className="mt-3 flex items-center gap-3 text-[11.5px]">
                      {p.githubUrl && (
                        <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-brand hover:underline">
                          <Github size={11} /> GitHub
                        </a>
                      )}
                      {p.liveUrl && (
                        <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-brand hover:underline">
                          <ExternalLink size={11} /> Live
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Panel>
      </div>

      <SkillBadgeModal open={badgeModalOpen} onClose={() => setBadgeModalOpen(false)} />
    </PageShell>
  );
}
