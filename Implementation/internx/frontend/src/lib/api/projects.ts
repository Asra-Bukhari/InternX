import { api } from "./client";
import type {
  BackendProject,
  Difficulty,
  ContractType,
  ProjectDeliverable,
} from "@/types/project";

export interface ProjectListResponse {
  count: number;
  projects: BackendProject[];
}

export interface ProjectDetailResponse {
  project: BackendProject;
}

export interface ProjectMutationResponse {
  message: string;
  project: BackendProject;
}

export interface ProjectFilters {
  skillsRequired?: string;
  difficulty?: Difficulty;
  contractType?: ContractType;
  /** "me" = caller's owned projects (business view) */
  owner?: "me";
}

export interface CreateProjectPayload {
  title: string;
  summary?: string;
  description: string;
  category?: string;
  skillsRequired: string[];
  difficulty: Difficulty;
  contractType: ContractType;
  durationLabel?: string;
  hoursPerDay?: string;
  budget?: number;
  paymentNotes?: string;
  deliverables?: ProjectDeliverable[];
}

export const projectsApi = {
  list: (filters: ProjectFilters = {}) =>
    api.get<ProjectListResponse>("/api/projects", {
      query: {
        skillsRequired: filters.skillsRequired,
        difficulty: filters.difficulty,
        contractType: filters.contractType,
        owner: filters.owner,
      },
    }),

  myProjects: () => api.get<ProjectListResponse>("/api/projects", { query: { owner: "me" } }),

  get: (id: string) => api.get<ProjectDetailResponse>(`/api/projects/${id}`),

  create: (payload: CreateProjectPayload) =>
    api.post<ProjectMutationResponse>("/api/projects", payload),

  update: (id: string, payload: Partial<CreateProjectPayload>) =>
    api.put<ProjectMutationResponse>(`/api/projects/${id}`, payload),

  setStatus: (id: string, status: "open" | "in-progress" | "completed") =>
    api.patch<ProjectMutationResponse>(`/api/projects/${id}/status`, { status }),
};
