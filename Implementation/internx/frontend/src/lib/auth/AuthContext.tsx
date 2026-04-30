import { createContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User, UserRole } from "@/types/user";

export interface AuthState {
  user: User | null;
  loading: boolean;
  loginAs: (role: UserRole) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthState | undefined>(undefined);

const STORAGE_KEY = "internx_mock_user";

const MOCK_USERS: Record<UserRole, User> = {
  student: {
    id: "u-student-1",
    name: "Aarav Sharma",
    email: "aarav.sharma@iitd.ac.in",
    role: "student",
    isVerified: true,
  },
  business: {
    id: "u-business-1",
    name: "Tara Chen",
    email: "tara@techcraft.co",
    role: "business",
    isVerified: true,
  },
  admin: {
    id: "u-admin-1",
    name: "Admin",
    email: "admin@internx.app",
    role: "admin",
    isVerified: true,
  },
};

function readStored(): User | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(readStored());
    setLoading(false);
  }, []);

  const value = useMemo<AuthState>(() => ({
    user,
    loading,
    loginAs: (role) => {
      const u = MOCK_USERS[role];
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      setUser(u);
    },
    logout: () => {
      sessionStorage.removeItem(STORAGE_KEY);
      setUser(null);
    },
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
