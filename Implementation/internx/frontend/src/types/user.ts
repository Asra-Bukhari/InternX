export type UserRole = "student" | "business" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  studentCardUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}
