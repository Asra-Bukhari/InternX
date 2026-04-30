import { useState } from "react";
import { Link, NavLink } from "react-router";
import { Search, Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { NotificationBell } from "@/components/nav/NotificationBell";
import { UserMenu } from "@/components/nav/UserMenu";
import { cn } from "@/lib/utils/cn";

export interface DashboardNavItem {
  to: string;
  label: string;
  end?: boolean;
}

interface DashboardTopBarProps {
  navItems: DashboardNavItem[];
  brandSuffix: string;
  profileHref: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
}

/**
 * Shared dashboard top navigation. Used by both Student and Business
 * dashboard layouts — the only differences are nav items and the
 * brand suffix label.
 */
export function DashboardTopBar({
  navItems,
  brandSuffix,
  profileHref,
  showSearch = false,
  searchPlaceholder = "Search…",
}: DashboardTopBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border-subtle bg-bg/95 backdrop-blur">
      <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-8">
          <Link to={navItems[0]?.to ?? "/"} className="flex-shrink-0">
            <Logo suffix={brandSuffix} />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-1.5 text-[13px] transition-colors font-medium",
                    isActive
                      ? "bg-brand/10 text-brand"
                      : "text-text-subtle hover:bg-surface-2 hover:text-text",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {showSearch && (
            <div className="hidden md:flex h-9 items-center gap-2 rounded-md border border-border-default bg-surface-2 px-3 w-56">
              <Search size={14} className="text-text-subtle" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                className="flex-1 bg-transparent text-[12.5px] text-text outline-none placeholder:text-text-subtle"
              />
            </div>
          )}
          <NotificationBell />
          <UserMenu profileHref={profileHref} />
          <button
            className="lg:hidden h-9 w-9 grid place-items-center rounded-md border border-border-default bg-surface-2 text-text"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Open menu"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-border-subtle bg-bg/95 backdrop-blur">
          <nav className="flex flex-col px-4 py-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-2 text-[14px] font-medium",
                    isActive ? "bg-brand/10 text-brand" : "text-text-muted hover:bg-surface-2 hover:text-text",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
