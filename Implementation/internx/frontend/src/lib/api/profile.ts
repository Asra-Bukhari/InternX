import { api } from "./client";
import type { User } from "@/types/user";
import type {
  Profile,
  FullProfile,
  ProfileExtension,
  Availability,
} from "@/types/profile";

const EXT_PREFIX = "__INTERNX_EXT__";

/** Detect and parse an extension blob saved into Profile.degree. */
function parseDegreeField(degree?: string): { ext: ProfileExtension; raw: string } {
  if (!degree) return { ext: {}, raw: "" };
  if (degree.startsWith(EXT_PREFIX)) {
    try {
      const parsed = JSON.parse(degree.slice(EXT_PREFIX.length)) as ProfileExtension;
      return { ext: parsed || {}, raw: parsed?._degree ?? "" };
    } catch {
      return { ext: {}, raw: degree };
    }
  }
  return { ext: { _degree: degree }, raw: degree };
}

/** Serialize extension into the degree field. */
function encodeDegreeField(ext: ProfileExtension): string {
  return EXT_PREFIX + JSON.stringify(ext);
}

export function toFullProfile(profile: Profile | null): FullProfile | null {
  if (!profile) return null;
  const { ext, raw } = parseDegreeField(profile.degree);
  return {
    ...profile,
    ext,
    cleanDegree: ext._degree ?? raw,
  };
}

/** Returns true when student has completed mandatory profile setup. */
export function isProfileComplete(p: FullProfile | null): boolean {
  if (!p) return false;
  if (p.ext.profileCompleted) return true;
  // Fallback heuristic: required fields present
  return Boolean(
    p.ext.bio &&
      p.ext.headline &&
      p.ext.location &&
      p.university &&
      p.ext._degreeLevel &&
      p.ext._degree &&
      p.semester &&
      p.ext._graduationYear &&
      p.skills &&
      p.skills.length > 0 &&
      p.ext.availabilityExt?.hoursPerDay,
  );
}

/** Days remaining until skills can be edited again; 0 if editable now. */
export function skillsLockedDaysLeft(p: FullProfile | null): number {
  if (!p?.ext.lastSkillUpdate) return 0;
  const last = new Date(p.ext.lastSkillUpdate).getTime();
  if (Number.isNaN(last)) return 0;
  const sixMonths = 1000 * 60 * 60 * 24 * 30 * 6;
  const elapsed = Date.now() - last;
  if (elapsed >= sixMonths) return 0;
  return Math.ceil((sixMonths - elapsed) / (1000 * 60 * 60 * 24));
}

export interface ProfileResponse {
  user: User;
  profile: Profile | null;
}

export interface RawProfileUpdatePayload {
  university?: string;
  degree?: string;
  semester?: string;
  skills?: string[];
  availability?: Availability;
}

export interface ProfileUpdatePayload {
  university?: string;
  semester?: string;
  skills?: string[];
  availability?: Availability;
  /** Extension patch — merged with existing extension blob. */
  ext?: Partial<ProfileExtension>;
}

/**
 * Update profile by merging extension fields. Caller should pass the existing
 * profile so we can preserve unrelated extension values.
 */
function buildUpdate(
  existing: FullProfile | null,
  patch: ProfileUpdatePayload,
): RawProfileUpdatePayload {
  const out: RawProfileUpdatePayload = {};
  if (patch.university !== undefined) out.university = patch.university;
  if (patch.semester !== undefined) out.semester = patch.semester;
  if (patch.skills !== undefined) out.skills = patch.skills;
  if (patch.availability !== undefined) out.availability = patch.availability;

  if (patch.ext !== undefined) {
    const merged: ProfileExtension = {
      ...(existing?.ext ?? {}),
      ...patch.ext,
    };
    out.degree = encodeDegreeField(merged);
  }
  return out;
}

export const profileApi = {
  getMe: () => api.get<ProfileResponse>("/api/profile/me"),

  updateRaw: (payload: RawProfileUpdatePayload) =>
    api.put<{ message: string; profile: Profile }>("/api/profile/me", payload),

  /** High-level update that handles extension merging. */
  update: (payload: ProfileUpdatePayload, existing: FullProfile | null) =>
    api.put<{ message: string; profile: Profile }>(
      "/api/profile/me",
      buildUpdate(existing, payload),
    ),
};
