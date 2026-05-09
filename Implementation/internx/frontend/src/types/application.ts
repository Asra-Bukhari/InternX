import type { BackendProject } from "./project";

export type ApplicationStatus = "pending" | "accepted" | "rejected";

export interface BackendApplicationProjectRef {
  _id: string;
  title?: string;
  status?: BackendProject["status"];
  budget?: number;
  difficulty?: BackendProject["difficulty"];
  contractType?: BackendProject["contractType"];
  businessId?: string | { _id: string; name?: string; email?: string };
}

export interface BackendApplication {
  _id: string;
  projectId: string | BackendApplicationProjectRef;
  studentId:
    | string
    | { _id: string; name?: string; email?: string; isVerified?: boolean };
  whyMeEssay?: string;
  aiTestScore?: number;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt?: string;
}

export function projectIdOf(a: BackendApplication): string {
  return typeof a.projectId === "string" ? a.projectId : a.projectId._id;
}
export function projectTitleOf(a: BackendApplication): string {
  return typeof a.projectId === "string" ? "Project" : a.projectId.title ?? "Project";
}
export function projectBusinessNameOf(a: BackendApplication): string {
  if (typeof a.projectId === "string") return "Business";
  const biz = a.projectId.businessId;
  if (!biz) return "Business";
  if (typeof biz === "string") return "Business";
  return biz.name ?? "Business";
}
export function studentIdOf(a: BackendApplication): string {
  return typeof a.studentId === "string" ? a.studentId : a.studentId._id;
}
export function studentNameOf(a: BackendApplication): string {
  return typeof a.studentId === "string" ? "Student" : a.studentId.name ?? "Student";
}
