/** Deliverable submission as stored on the backend. */
export interface BackendDeliverable {
  _id: string;
  projectId: string;
  studentId: string | { _id: string; name?: string; email?: string };
  fileUrl: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Project-embedded deliverable definition. */
export interface ProjectDeliverable {
  _id?: string;
  title: string;
  description?: string;
  deadline?: string;
  paymentPercent?: number;
}

export function studentNameOf(d: BackendDeliverable): string {
  return typeof d.studentId === "string" ? "Student" : d.studentId.name ?? "Student";
}

export function isDeliverableApproved(d: BackendDeliverable): boolean {
  return d.status === "approved";
}

export function isDeliverablePending(d: BackendDeliverable): boolean {
  return d.status === "pending";
}

export function deliverableStatusLabel(status: string): string {
  switch (status) {
    case "approved":
      return "Approved";
    case "rejected":
      return "Revision Requested";
    case "pending":
      return "Pending Review";
    default:
      return status;
  }
}
