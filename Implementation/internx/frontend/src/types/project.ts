export type Difficulty = "easy" | "medium" | "hard";
export type ContractType = "fixed" | "hourly";
export type ProjectStatus = "open" | "in-progress" | "completed";

export interface ProjectDeliverable {
  _id?: string;
  title: string;
  description?: string;
  deadline?: string;
  paymentPercent?: number;
}

/** Project as stored on the backend (Mongoose shape). */
export interface BackendProject {
  _id: string;
  businessId:
    | string
    | { _id: string; name?: string; email?: string };
  title: string;
  summary?: string;
  description: string;
  category?: string;
  skillsRequired?: string[];
  difficulty: Difficulty;
  contractType: ContractType;
  durationLabel?: string;
  hoursPerDay?: string;
  budget?: number;
  paymentNotes?: string;
  deliverables?: ProjectDeliverable[];
  applicants?: string[];
  selectedStudent?:
    | string
    | { _id: string; name?: string; email?: string }
    | null;
  status?: ProjectStatus;
  createdAt?: string;
  updatedAt?: string;
}

/** UI display difficulty labels */
export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

/** UI display contract labels */
export const CONTRACT_LABEL: Record<ContractType, string> = {
  fixed: "Fixed",
  hourly: "Hourly",
};

/** Helpers */
export function projectOwnerId(p: BackendProject): string {
  return typeof p.businessId === "string" ? p.businessId : p.businessId._id;
}

export function projectOwnerName(p: BackendProject): string {
  return typeof p.businessId === "string" ? "Business" : p.businessId.name ?? "Business";
}

export function projectOwnerInitials(p: BackendProject): string {
  const name = projectOwnerName(p);
  return (
    name
      .split(" ")
      .map((s) => s[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "B"
  );
}

export function selectedStudentId(p: BackendProject): string | null {
  if (!p.selectedStudent) return null;
  return typeof p.selectedStudent === "string" ? p.selectedStudent : p.selectedStudent._id;
}

export function selectedStudentName(p: BackendProject): string | null {
  if (!p.selectedStudent) return null;
  return typeof p.selectedStudent === "string" ? null : p.selectedStudent.name ?? null;
}

export function applicantsCount(p: BackendProject): number {
  return p.applicants?.length ?? 0;
}

export function remainingSlots(p: BackendProject): number {
  return Math.max(0, 10 - applicantsCount(p));
}

export function relativePostedAt(p: BackendProject): string {
  const iso = p.createdAt;
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

export function uiStatusLabel(p: BackendProject): string {
  if (p.status === "in-progress") return "In Progress";
  if (p.status === "completed") return "Completed";
  if (p.status === "open") return applicantsCount(p) > 0 ? "Hiring" : "Open";
  return "Draft";
}

export function uiProgress(p: BackendProject): number {
  if (p.status === "completed") return 100;
  if (p.status === "in-progress") return 50;
  return 0;
}
