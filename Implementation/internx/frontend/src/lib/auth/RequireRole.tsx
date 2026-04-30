import { Navigate, useLocation } from "react-router";
import { useAuth } from "./useAuth";
import type { UserRole } from "@/types/user";

interface RequireRoleProps {
  role: UserRole;
  children: React.ReactNode;
}

/**
 * RequireRole — gate a route subtree behind a role.
 * In dev (mock auth) the user can switch roles via the Login page.
 * Routes redirect to /login if no user, or to the user's correct dashboard if mismatched.
 */
export function RequireRole({ role, children }: RequireRoleProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-text-muted text-sm">
        Loading…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (user.role !== role) {
    const target = user.role === "business" ? "/dashboard/business" : "/dashboard/student";
    return <Navigate to={target} replace />;
  }

  return <>{children}</>;
}
