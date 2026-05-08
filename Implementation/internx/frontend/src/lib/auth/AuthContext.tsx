import { createContext, useEffect, useMemo, useState, useCallback, type ReactNode } from "react";
import type { User, UserRole } from "@/types/user";
import type { FullProfile } from "@/types/profile";
import { authApi, type LoginPayload, type RegisterPayload } from "@/lib/api/auth";
import { profileApi, toFullProfile, isProfileComplete } from "@/lib/api/profile";
import {
  TOKEN_KEY,
  setToken,
  clearToken,
  getToken,
  onUnauthorized,
  ApiError,
} from "@/lib/api/client";

export interface AuthState {
  user: User | null;
  profile: FullProfile | null;
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  profileComplete: boolean;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthState | undefined>(undefined);

function normalizeUser(raw: unknown): User | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const id = (r.id as string) || (r._id as string);
  if (!id) return null;
  return {
    id,
    name: (r.name as string) || "",
    email: (r.email as string) || "",
    role: r.role as UserRole,
    isVerified: Boolean(r.isVerified),
    studentCardUrl: r.studentCardUrl as string | undefined,
    createdAt: r.createdAt as string | undefined,
    updatedAt: r.updatedAt as string | undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<FullProfile | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const performLogout = useCallback(() => {
    clearToken();
    setTokenState(null);
    setUser(null);
    setProfile(null);
  }, []);

  useEffect(() => {
    return onUnauthorized(() => {
      performLogout();
    });
  }, [performLogout]);

  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      const stored = getToken();
      if (!stored) {
        setLoading(false);
        return;
      }
      setTokenState(stored);
      try {
        const res = await profileApi.getMe();
        if (cancelled) return;
        const normalized = normalizeUser(res.user);
        if (normalized) {
          setUser(normalized);
          setProfile(toFullProfile(res.profile));
        } else {
          performLogout();
        }
      } catch (err) {
        if (cancelled) return;
        if (!(err instanceof ApiError) || err.status !== 401) {
          performLogout();
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [performLogout]);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === TOKEN_KEY && e.newValue === null) {
        setTokenState(null);
        setUser(null);
        setProfile(null);
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const refreshProfile = useCallback(async () => {
    const res = await profileApi.getMe();
    const normalized = normalizeUser(res.user);
    if (normalized) {
      setUser(normalized);
      setProfile(toFullProfile(res.profile));
    }
  }, []);

  const login = useCallback<AuthState["login"]>(async (payload) => {
    const res = await authApi.login(payload);
    setToken(res.token);
    setTokenState(res.token);
    const normalized = normalizeUser(res.user);
    if (!normalized) throw new ApiError(500, "Malformed login response", res);
    setUser(normalized);
    profileApi
      .getMe()
      .then((r) => {
        const u = normalizeUser(r.user);
        if (u) {
          setUser(u);
          setProfile(toFullProfile(r.profile));
        }
      })
      .catch(() => {});
    return normalized;
  }, []);

  const register = useCallback<AuthState["register"]>(async (payload) => {
    const res = await authApi.register(payload);
    setToken(res.token);
    setTokenState(res.token);
    const normalized = normalizeUser(res.user);
    if (!normalized) throw new ApiError(500, "Malformed register response", res);
    setUser(normalized);
    profileApi
      .getMe()
      .then((r) => {
        const u = normalizeUser(r.user);
        if (u) {
          setUser(u);
          setProfile(toFullProfile(r.profile));
        }
      })
      .catch(() => {});
    return normalized;
  }, []);

  const logout = useCallback<AuthState["logout"]>(async () => {
    try {
      await authApi.logout();
    } catch {
      /* best-effort */
    }
    performLogout();
  }, [performLogout]);

  const profileComplete = useMemo(() => {
    if (!user) return false;
    if (user.role !== "student") return true; // business has no setup flow
    return isProfileComplete(profile);
  }, [user, profile]);

  const value = useMemo<AuthState>(
    () => ({
      user,
      profile,
      token,
      role: user?.role ?? null,
      isAuthenticated: !!user && !!token,
      profileComplete,
      loading,
      login,
      register,
      logout,
      refreshProfile,
    }),
    [user, profile, token, profileComplete, loading, login, register, logout, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
