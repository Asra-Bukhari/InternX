import { api } from "./client";
import type { BackendApplication } from "@/types/application";

export interface EligibilityResponse {
  eligible: boolean;
  reason: string;
  details?: {
    matched: string[];
    missing: string[];
    matchScore: string;
    note?: string;
  };
}

export const eligibilityApi = {
  check: (projectId: string) =>
    api.get<EligibilityResponse>(`/api/eligibility/check/${projectId}`),
};

export interface ApplyPayload {
  projectId: string;
  whyMeEssay?: string;
  aiTestScore?: number;
}

export interface ApplyResponse {
  message: string;
  application: BackendApplication;
}

export const applicationsApi = {
  apply: (payload: ApplyPayload) =>
    api.post<ApplyResponse>("/api/applications", payload),

  myApplications: () => api.get<BackendApplication[]>("/api/applications/me"),

  forProject: (projectId: string) =>
    api.get<BackendApplication[]>(`/api/applications/project/${projectId}`),

  accept: (applicationId: string) =>
    api.patch<{ message: string; application: BackendApplication }>(
      `/api/applications/${applicationId}/accept`
    ),

  reject: (applicationId: string) =>
    api.patch<{ message: string; application: BackendApplication }>(
      `/api/applications/${applicationId}/reject`
    ),
};

/** Skill-match rule: student must match ≥ ceil(N / 2) of project tags. */
export function skillMatchOk(projectTags: string[], studentSkills: string[]): {
  ok: boolean;
  required: number;
  matched: string[];
} {
  const required = Math.ceil((projectTags.length || 0) / 2);
  const lc = new Set(studentSkills.map((s) => s.toLowerCase()));
  const matched = projectTags.filter((t) => lc.has(t.toLowerCase()));
  return { ok: matched.length >= required, required, matched };
}
