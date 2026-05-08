import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { AlertCircle, CheckCircle2, User, GraduationCap, Wrench, CalendarClock, Briefcase, Save } from "lucide-react";
import { PageShell } from "@/components/forms/PageShell";
import { Panel } from "@/components/forms/Panel";
import { FormField } from "@/components/forms/FormField";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PrimaryButton } from "@/components/forms/PrimaryButton";
import { GhostButton } from "@/components/forms/GhostButton";
import { ProgressBar } from "@/components/data-display/ProgressBar";
import { useAuth } from "@/lib/auth/useAuth";
import { profileApi, skillsLockedDaysLeft } from "@/lib/api/profile";
import { ApiError } from "@/lib/api/client";
import { MAX_SKILLS } from "@/lib/constants/skills";
import type {
  PortfolioProject,
  AvailabilityExtended,
  ProfileExtension,
} from "@/types/profile";
import { SkillSelector } from "./profile-setup/SkillSelector";
import { AvailabilityEditor } from "./profile-setup/AvailabilityEditor";
import { PortfolioEditor } from "./profile-setup/PortfolioEditor";

const DEGREE_LEVELS = [
  "Bachelor's",
  "Master's",
  "PhD / Doctorate",
  "Associate's",
  "Diploma",
  "Other",
];

interface SetupForm {
  bio: string;
  headline: string;
  location: string;
  university: string;
  degreeLevel: string;
  degreeProgram: string;
  semester: string;
  graduationYear: string;
  cgpa: string;
  skills: string[];
  availability: AvailabilityExtended;
  portfolio: PortfolioProject[];
}

function blankPortfolioProject(): PortfolioProject {
  return {
    id: `pp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: "",
    description: "",
    technologies: [],
  };
}

export default function ProfileSetup() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const lockedDays = useMemo(() => skillsLockedDaysLeft(profile), [profile]);

  const [form, setForm] = useState<SetupForm>(() => ({
    bio: "",
    headline: "",
    location: "",
    university: "",
    degreeLevel: "",
    degreeProgram: "",
    semester: "",
    graduationYear: "",
    cgpa: "",
    skills: [],
    availability: {},
    portfolio: [blankPortfolioProject(), blankPortfolioProject(), blankPortfolioProject()],
  }));

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Hydrate from existing profile (allows resuming setup or editing later)
  useEffect(() => {
    if (!profile) return;
    const ext = profile.ext;
    const port = ext.portfolio && ext.portfolio.length > 0
      ? ext.portfolio
      : [blankPortfolioProject(), blankPortfolioProject(), blankPortfolioProject()];

    setForm({
      bio: ext.bio ?? "",
      headline: ext.headline ?? "",
      location: ext.location ?? "",
      university: profile.university ?? "",
      degreeLevel: ext._degreeLevel ?? "",
      degreeProgram: ext._degree ?? profile.degree ?? "",
      semester: profile.semester ?? "",
      graduationYear: ext._graduationYear ?? "",
      cgpa: ext._cgpa ?? "",
      skills: profile.skills ?? [],
      availability: ext.availabilityExt ?? {},
      portfolio: port,
    });
  }, [profile]);

  function patch<K extends keyof SetupForm>(k: K, v: SetupForm[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  // Completion progress
  const sectionStatus = useMemo(() => {
    const validPortfolio = form.portfolio.filter((p) => p.title.trim() && p.description.trim());
    return {
      basic: Boolean(form.bio && form.headline && form.location),
      academic: Boolean(
        form.university && form.degreeLevel && form.degreeProgram && form.semester && form.graduationYear,
      ),
      skills: form.skills.length > 0 && form.skills.length <= MAX_SKILLS,
      availability: Boolean(form.availability.hoursPerDay),
      portfolio: validPortfolio.length >= 3,
    };
  }, [form]);

  const completedSections = Object.values(sectionStatus).filter(Boolean).length;
  const totalSections = 5;
  const progressPct = Math.round((completedSections / totalSections) * 100);
  const allDone = completedSections === totalSections;

  function validate(): string | null {
    if (!sectionStatus.basic) return "Complete the Basic Profile section.";
    if (!sectionStatus.academic) return "Complete the Academic Info section.";
    if (!sectionStatus.skills) return `Add 1–${MAX_SKILLS} skills.`;
    if (!sectionStatus.availability) return "Set your daily availability.";
    if (!sectionStatus.portfolio) return "Add at least 3 portfolio projects.";
    if (form.graduationYear && !/^\d{4}$/.test(form.graduationYear)) {
      return "Enter a 4-digit graduation year.";
    }
    return null;
  }

  async function onSave() {
    setError(null);
    setSuccess(null);

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setSubmitting(true);
    try {
      const skillsChanged = JSON.stringify(profile?.skills ?? []) !== JSON.stringify(form.skills);
      const validPortfolio = form.portfolio.filter((p) => p.title.trim() && p.description.trim());

      const ext: Partial<ProfileExtension> = {
        bio: form.bio,
        headline: form.headline,
        location: form.location,
        _degree: form.degreeProgram,
        _degreeLevel: form.degreeLevel,
        _graduationYear: form.graduationYear,
        _cgpa: form.cgpa,
        availabilityExt: form.availability,
        portfolio: validPortfolio,
        profileCompleted: true,
        ...(skillsChanged && lockedDays === 0
          ? { lastSkillUpdate: new Date().toISOString() }
          : {}),
      };

      await profileApi.update(
        {
          university: form.university,
          semester: form.semester,
          skills: lockedDays === 0 ? form.skills : profile?.skills ?? [],
          ext,
        },
        profile,
      );

      await refreshProfile();
      setSuccess("Profile setup complete.");
      setTimeout(() => navigate("/dashboard/student", { replace: true }), 600);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save profile.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) return null;

  return (
    <PageShell
      title="Complete your profile"
      subtitle="Finish setup to unlock applications, messaging, and the project workspace."
      actions={
        <>
          <GhostButton size="md" onClick={() => navigate("/dashboard/student")}>
            Save & exit
          </GhostButton>
          <PrimaryButton
            size="md"
            onClick={onSave}
            disabled={submitting || !allDone}
            icon={<Save size={14} />}
          >
            {submitting ? "Saving…" : allDone ? "Complete setup" : `Section ${completedSections}/${totalSections}`}
          </PrimaryButton>
        </>
      }
    >
      {/* Progress banner */}
      <Panel padding="p-5" className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <p className="text-[14px] font-semibold text-text">Onboarding progress</p>
            <p className="text-[12px] text-text-subtle mt-0.5">
              {allDone
                ? "All sections complete. Click 'Complete setup' to unlock platform features."
                : `${completedSections} of ${totalSections} sections complete.`}
            </p>
          </div>
          <span className="text-[14px] font-semibold text-brand">{progressPct}%</span>
        </div>
        <ProgressBar value={progressPct} />
      </Panel>

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-md border border-status-danger/30 bg-status-danger-soft px-3 py-2.5 text-[12.5px] text-status-danger">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="mb-4 flex items-start gap-2 rounded-md border border-status-success/30 bg-status-success-soft px-3 py-2.5 text-[12.5px] text-status-success">
          <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Section 1 — Basic Profile */}
        <Panel padding="p-6">
          <SectionStatusHeader title="Basic Profile" icon={<User size={16} />} done={sectionStatus.basic} />
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1">
              <FormField label="Profile picture" hint="Upload coming soon — initials shown for now">
                <div className="flex items-center gap-3">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-brand/15 text-[20px] font-semibold text-brand">
                    {user.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
                  </div>
                  <GhostButton size="sm" disabled>Upload</GhostButton>
                </div>
              </FormField>
            </div>
            <div className="lg:col-span-2 space-y-4">
              <FormField label="Headline" required hint="e.g. Frontend Developer | FAST NUCES">
                <Input value={form.headline} onChange={(e) => patch("headline", e.target.value)} placeholder="Frontend Developer | FAST NUCES" />
              </FormField>
              <FormField label="Bio / About me" required>
                <Textarea
                  rows={4}
                  value={form.bio}
                  onChange={(e) => patch("bio", e.target.value)}
                  placeholder="Short intro for businesses viewing your profile."
                />
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Location / City" required>
                  <Input value={form.location} onChange={(e) => patch("location", e.target.value)} placeholder="Lahore, PK" />
                </FormField>
                <FormField label="Contact email">
                  <Input value={user.email} disabled />
                </FormField>
              </div>
            </div>
          </div>
        </Panel>

        {/* Section 2 — Academic Info */}
        <Panel padding="p-6">
          <SectionStatusHeader title="Academic Information" icon={<GraduationCap size={16} />} done={sectionStatus.academic} />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="University" required>
              <Input value={form.university} onChange={(e) => patch("university", e.target.value)} placeholder="FAST NUCES" />
            </FormField>
            <FormField label="Degree level" required>
              <Select value={form.degreeLevel} onValueChange={(v) => patch("degreeLevel", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select degree level" />
                </SelectTrigger>
                <SelectContent>
                  {DEGREE_LEVELS.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Degree program" required>
              <Input value={form.degreeProgram} onChange={(e) => patch("degreeProgram", e.target.value)} placeholder="Computer Science" />
            </FormField>
            <FormField label="Semester" required>
              <Input value={form.semester} onChange={(e) => patch("semester", e.target.value)} placeholder="5th" />
            </FormField>
            <FormField label="Expected graduation" required>
              <Input
                inputMode="numeric"
                maxLength={4}
                value={form.graduationYear}
                onChange={(e) => patch("graduationYear", e.target.value.replace(/\D/g, ""))}
                placeholder="2027"
              />
            </FormField>
            <FormField label="CGPA (optional)">
              <Input value={form.cgpa} onChange={(e) => patch("cgpa", e.target.value)} placeholder="3.7 / 4.0" />
            </FormField>
          </div>
        </Panel>

        {/* Section 3 — Skills */}
        <Panel padding="p-6">
          <SectionStatusHeader title="Skills" icon={<Wrench size={16} />} done={sectionStatus.skills} />
          <p className="text-[12.5px] text-text-subtle mb-4">
            Pick up to {MAX_SKILLS} skills. You can update skills once every 6 months.
          </p>
          <SkillSelector
            value={form.skills}
            onChange={(s) => patch("skills", s)}
            lockedDaysLeft={lockedDays}
          />
        </Panel>

        {/* Section 4 — Availability */}
        <Panel padding="p-6">
          <SectionStatusHeader title="Availability" icon={<CalendarClock size={16} />} done={sectionStatus.availability} />
          <AvailabilityEditor value={form.availability} onChange={(a) => patch("availability", a)} />
        </Panel>

        {/* Section 5 — Portfolio */}
        <Panel padding="p-6">
          <SectionStatusHeader title="University Projects / Portfolio" icon={<Briefcase size={16} />} done={sectionStatus.portfolio} />
          <p className="text-[12.5px] text-text-subtle mb-4">
            Add 3 to 5 projects. Helps businesses evaluate your work.
          </p>
          <PortfolioEditor value={form.portfolio} onChange={(p) => patch("portfolio", p)} />
        </Panel>

        <div className="flex justify-end gap-2 pt-2">
          <PrimaryButton
            size="lg"
            onClick={onSave}
            disabled={submitting || !allDone}
            icon={<Save size={15} />}
          >
            {submitting ? "Saving…" : "Complete setup"}
          </PrimaryButton>
        </div>
      </div>
    </PageShell>
  );
}

function SectionStatusHeader({ title, icon, done }: { title: string; icon: React.ReactNode; done: boolean }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <div className={`grid h-8 w-8 place-items-center rounded-md ${done ? "bg-status-success-soft text-status-success" : "bg-brand/15 text-brand"}`}>
          {done ? <CheckCircle2 size={16} /> : icon}
        </div>
        <h2 className="text-[16px] font-semibold tracking-tight text-text">{title}</h2>
      </div>
      <span className={`text-[11.5px] font-medium ${done ? "text-status-success" : "text-text-subtle"}`}>
        {done ? "Complete" : "Required"}
      </span>
    </div>
  );
}

// Re-export sub-components from this file's neighbours so the orchestrator
// stays the entry point for the route.
