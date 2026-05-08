import { Navigate, useLocation } from "react-router";
import { useAuth } from "./useAuth";
import type { UserRole } from "@/types/user";

interface RequireRoleProps {
  role: UserRole;
  children: React.ReactNode;
}

function LoadingScreen() {
  return (
    <div className="min-h-screen grid place-items-center text-text-muted text-sm">
      Loading…
    </div>
  );
}

export function RequireRole({ role, children }: RequireRoleProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen />;

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (user.role !== role) {
    const target =
      user.role === "business"
        ? "/dashboard/business"
        : user.role === "admin"
        ? "/dashboard/business"
        : "/dashboard/student";
    return <Navigate to={target} replace />;
  }

  return <>{children}</>;
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return <>{children}</>;
}

/**
 * Block a feature page until the student has completed profile setup.
 * Renders a redirect to /dashboard/student/profile/setup if incomplete.
 */
export function RequireProfileComplete({ children }: { children: React.ReactNode }) {
  const { profileComplete, loading, user } = useAuth();
  if (loading) return <LoadingScreen />;
  if (user?.role !== "student") return <>{children}</>;
  if (!profileComplete) {
    return <Navigate to="/dashboard/student/profile/setup" replace />;
  }
  return <>{children}</>;
}
