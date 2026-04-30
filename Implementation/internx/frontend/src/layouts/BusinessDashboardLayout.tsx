import { Outlet } from "react-router";
import { DashboardTopBar, type DashboardNavItem } from "@/components/nav/DashboardTopBar";
import { RequireRole } from "@/lib/auth/RequireRole";

const BUSINESS_NAV: DashboardNavItem[] = [
  { to: "/dashboard/business", label: "Dashboard", end: true },
  { to: "/dashboard/business/projects", label: "Projects" },
  { to: "/dashboard/business/applicants", label: "Applicants" },
  { to: "/dashboard/business/messages", label: "Messages" },
  { to: "/dashboard/business/payments", label: "Payments" },
  { to: "/dashboard/business/profile", label: "Profile" },
];

export default function BusinessDashboardLayout() {
  return (
    <RequireRole role="business">
      <div className="min-h-screen bg-bg text-foreground">
        <DashboardTopBar
          navItems={BUSINESS_NAV}
          brandSuffix="/ Business"
          profileHref="/dashboard/business/profile"
        />
        <main>
          <Outlet />
        </main>
      </div>
    </RequireRole>
  );
}
