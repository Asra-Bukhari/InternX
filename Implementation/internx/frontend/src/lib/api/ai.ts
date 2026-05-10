/**
 * AI Backend API — calls to the Node AI endpoints (localhost:5000)
 * and the Python proctoring server (localhost:5001).
 */
import { api, ApiError, getToken } from "./client";

/* ── Types ──────────────────────────────────────────────────────────── */

export interface TestQuestion {
  type: "mcq" | "short_answer" | "coding";
  questionText: string;
  options?: string[];
}

export interface GenerateSkillTestResponse {
  testId: string;
  skillTopic: string;
  testType: "skill_badge";
  questions: TestQuestion[];
}

export interface GenerateProjectTestResponse {
  testId: string;
  projectId: string;
  testType: "project_application";
  questions: TestQuestion[];
}

export interface PerQuestionResult {
  questionIndex: number;
  marks: number;
  maxMarks: number;
  comment: string;
}

export interface EvaluateTestResponse {
  score: number;
  passed: boolean;
  perQuestion: PerQuestionResult[];
  overallFeedback: string;
  badgeAwarded?: string;
  /** For project tests — auto-apply after pass */
  testType?: string;
  projectId?: string;
}

export interface ProctorAnalyzeResponse {
  cheating: boolean;
  reason?: "no_face" | "multiple_faces" | "looking_away";
  message?: string;
}

export interface ProjectRecommendation {
  projectId: string;
  title: string;
  matchScore: number;
  reason: string;
  project: Record<string, unknown>;
}

export interface ApplicantRecommendation {
  applicationId: string;
  studentId: string;
  name: string;
  matchScore: number;
  reason: string;
}

export interface RecommendedProjectsResponse {
  recommendations: ProjectRecommendation[];
}

export interface RecommendedApplicantsResponse {
  projectId: string;
  projectTitle: string;
  totalApplicants: number;
  recommendations: ApplicantRecommendation[];
}

/* ── Skill Badge Test ───────────────────────────────────────────────── */

export const aiApi = {
  generateSkillTest: (studentId: string, skillTopic: string) =>
    api.post<GenerateSkillTestResponse>("/api/ai/generate-skill-test", {
      studentId,
      skillTopic,
    }),

  generateProjectTest: (payload: {
    studentId: string;
    projectId: string;
    projectTitle: string;
    projectDescription: string;
    skillsRequired: string[];
  }) => api.post<GenerateProjectTestResponse>("/api/ai/generate-project-test", payload),

  evaluateTest: (testId: string, answers: Record<string, string>) =>
    api.post<EvaluateTestResponse>("/api/ai/evaluate-test", { testId, answers }),

  flagCheating: (testId: string, reason: string, message: string) =>
    api.post("/api/ai/flag-cheating", { testId, reason, message }),
};

/* ── Proctoring — direct fetch to Python server (different origin) ── */

const PROCTOR_BASE = "http://localhost:5001";

export async function analyzeFrame(frameBase64: string): Promise<ProctorAnalyzeResponse> {
  const token = getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${PROCTOR_BASE}/proctor/analyze`, {
    method: "POST",
    headers,
    body: JSON.stringify({ frame: frameBase64 }),
  });

  if (!response.ok) {
    throw new ApiError(response.status, "Proctoring server error", null);
  }

  return response.json();
}

/* ── Recommendations ────────────────────────────────────────────────── */

export const recommendationsApi = {
  projectsForStudent: (studentId: string) =>
    api.get<RecommendedProjectsResponse>(`/api/recommendations/projects/${studentId}`),

  applicantsForProject: (projectId: string) =>
    api.get<RecommendedApplicantsResponse>(`/api/recommendations/applicants/${projectId}`),
};
