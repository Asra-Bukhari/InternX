import { api } from "./client";
import type { User, UserRole } from "@/types/user";

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export const authApi = {
  login: (payload: LoginPayload) =>
    api.post<AuthResponse>("/api/auth/login", payload, { skipAuth: true }),

  register: (payload: RegisterPayload) =>
    api.post<AuthResponse>("/api/auth/register", payload, { skipAuth: true }),

  logout: () => api.post<{ message: string }>("/api/auth/logout"),
};
