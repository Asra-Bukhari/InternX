export type ApplicationStatus = "pending" | "shortlisted" | "rejected" | "selected";

export interface Application {
  id: string;
  projectId: string;
  projectTitle: string;
  business: string;
  businessLogo: string;
  appliedAt: string;
  status: ApplicationStatus;
  budget: string;
}
