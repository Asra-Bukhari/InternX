import { api } from "./client";
import type { Project, Difficulty, ContractType } from "@/types/project";

export interface BackendBusinessRef {
  _id: string;
  name?: string;
  email?: string;
}

export interface BackendProject {
  _id: string;
  businessId: string | BackendBusinessRef;
  title: string;
  description: string;
  skillsRequired?: string[];
  difficulty: "easy" | "medium" | "hard";
  contractType: "fixed" | "hourly";
  applicants?: string[];
  selectedStudent?: string | null;
  status?: "open" | "in-progress" | "completed";
  createdAt?: string;
  updatedAt?: string;
}

const DIFFICULTY_MAP: Record<BackendProject["difficulty"], Difficulty> = {
  easy: "Basic",
  medium: "Medium",
  hard: "Hard",
};

const CONTRACT_MAP: Record<BackendProject["contractType"], ContractType> = {
  fixed: "Fixed",
  hourly: "Hourly",
};

function relativeTime(iso?: string): string {
  if (!iso) return "Recently";
  const ms = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(ms)) return "Recently";
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  if (days < 1) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function businessName(b: BackendProject["businessId"]): { name: string; logo: string } {
  if (typeof b === "string") return { name: "Business", logo: "B" };
  const name = b.name ?? "Business";
  const logo = name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return { name, logo: logo || "B" };
}

export function adaptProject(b: BackendProject): Project {
  const { name, logo } = businessName(b.businessId);
  return {
    id: b._id,
    title: b.title,
    business: name,
    businessLogo: logo,
    description: b.description,
    longDescription: b.description,
    skills: b.skillsRequired ?? [],
    difficulty: DIFFICULTY_MAP[b.difficulty] ?? "Medium",
    contract: CONTRACT_MAP[b.contractType] ?? "Fixed",
    budget: "—",
    budgetValue: 0,
    timeline: "—",
    posted: relativeTime(b.createdAt),
    applicants: b.applicants?.length ?? 0,
    status: b.status,
  };
}

export interface ProjectListResponse {
  count: number;
  projects: BackendProject[];
}

export interface ProjectDetailResponse {
  project: BackendProject;
}

export interface ProjectFilters {
  skillsRequired?: string;
  difficulty?: "easy" | "medium" | "hard";
  contractType?: "fixed" | "hourly";
}

export const projectsApi = {
  list: (filters: ProjectFilters = {}) =>
    api.get<ProjectListResponse>("/api/projects", {
      query: {
        skillsRequired: filters.skillsRequired,
        difficulty: filters.difficulty,
        contractType: filters.contractType,
      },
    }),

  get: (id: string) => api.get<ProjectDetailResponse>(`/api/projects/${id}`),
};
