export type Difficulty = "Basic" | "Medium" | "Hard" | "Hardcore";
export type ContractType = "Hourly" | "Fixed";
export type ProjectStatus = "open" | "in-progress" | "completed" | "draft";

export interface Project {
  id: string;
  title: string;
  business: string;
  businessLogo: string;
  description: string;
  longDescription?: string;
  skills: string[];
  difficulty: Difficulty;
  contract: ContractType;
  budget: string;
  budgetValue: number;
  timeline: string;
  posted: string;
  applicants: number;
  applied?: boolean;
  scope?: string[];
  status?: ProjectStatus;
}
