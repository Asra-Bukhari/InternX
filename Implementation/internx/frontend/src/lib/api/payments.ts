import { api } from "./client";
import type { BackendProjectRef } from "./messages";

export interface BackendPayment {
  _id: string;
  projectId: string | BackendProjectRef;
  businessId: string;
  studentId: string | { _id: string; name?: string; email?: string };
  amount: number;
  status: "pending" | "paid";
  createdAt: string;
}

export const paymentsApi = {
  myPayments: () => api.get<BackendPayment[]>("/api/payments/me"),
  create: (payload: { projectId: string; amount: number }) =>
    api.post<{ message: string; payment: BackendPayment }>("/api/payments", payload),
  complete: (id: string) =>
    api.patch<{ message: string; payment: BackendPayment }>(`/api/payments/${id}/complete`),
};

export function projectIdOf(p: BackendPayment): string {
  return typeof p.projectId === "string" ? p.projectId : p.projectId._id;
}

export function projectTitleOf(p: BackendPayment): string {
  return typeof p.projectId === "string" ? "Project" : p.projectId.title ?? "Project";
}

export function studentNameOf(p: BackendPayment): string {
  return typeof p.studentId === "string" ? "Student" : p.studentId.name ?? "Student";
}

export interface BackendDeliverable {
  _id: string;
  projectId: string;
  studentId: string | { _id: string; name?: string };
  fileUrl: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}

export const deliverablesApi = {
  forProject: (projectId: string) =>
    api.get<BackendDeliverable[]>(`/api/deliverables/${projectId}`),
  submit: (payload: { projectId: string; fileUrl: string }) =>
    api.post<{ message: string; deliverable: BackendDeliverable }>("/api/deliverables", payload),
  approve: (id: string) =>
    api.patch<{ message: string; deliverable: BackendDeliverable }>(`/api/deliverables/${id}/approve`),
};
