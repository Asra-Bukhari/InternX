import { api } from "./client";

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

export interface ApplyResponse {
  message: string;
  application: {
    _id: string;
    projectId: string;
    studentId: string;
    status: "pending" | "accepted" | "rejected";
  };
}

export const applicationsApi = {
  apply: (projectId: string) =>
    api.post<ApplyResponse>("/api/applications", { projectId }),
};
