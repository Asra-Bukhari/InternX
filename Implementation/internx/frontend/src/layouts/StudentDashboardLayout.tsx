import { Outlet } from "react-router";
import { DashboardTopBar, type DashboardNavItem } from "@/components/nav/DashboardTopBar";
import { RequireRole } from "@/lib/auth/RequireRole";

const STUDENT_NAV: DashboardNavItem[] = [
  { to: "/dashboard/student", label: "Dashboard", end: true },
  { to: "/dashboard/student/projects", label: "Projects" },
  { to: "/dashboard/student/applications", label: "Applications" },
  { to: "/dashboard/student/active", label: "Active Project" },
  { to: "/dashboard/student/messages", label: "Messages" },
  { to: "/dashboard/student/levels", label: "Levels" },
  { to: "/dashboard/student/profile", label: "Profile" },
];

export default function StudentDashboardLayout() {
  return (
    <RequireRole role="student">
      <div className="min-h-screen bg-bg text-foreground">
        <DashboardTopBar
          navItems={STUDENT_NAV}
          brandSuffix="/ Student"
          profileHref="/dashboard/student/profile"
          showSearch
          searchPlaceholder="Search projects…"
        />
        <main>
          <Outlet />
        </main>
      </div>
    </RequireRole>
  );
}
