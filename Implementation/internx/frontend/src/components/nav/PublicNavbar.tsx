import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils/cn";

interface NavLinkItem {
  label: string;
  href: string;
  dropdown?: { label: string; description: string; href: string }[];
}

const NAV_LINKS: NavLinkItem[] = [
  { label: "Home", href: "/" },
  {
    label: "How It Works",
    href: "/how-it-works",
    dropdown: [
      { label: "For Students", description: "Apply to real projects and grow your career", href: "/how-it-works#students" },
      { label: "For Businesses", description: "Post projects and hire verified student talent", href: "/how-it-works#businesses" },
    ],
  },
  {
    label: "Why InternX",
    href: "/why-resume",
    dropdown: [
      { label: "Our Philosophy", description: "Why we built a student-only platform", href: "/why-resume#philosophy" },
      { label: "vs Traditional Platforms", description: "How InternX compares", href: "/why-resume#comparison" },
    ],
  },
  {
    label: "Universities",
    href: "/universities",
    dropdown: [
      { label: "Partner Universities", description: "Browse our verified network", href: "/universities#partners" },
      { label: "Eligibility", description: "Who can join InternX", href: "/universities#eligibility" },
    ],
  },
  { label: "Pricing", href: "/pricing" },
];

export function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <nav
      ref={dropdownRef}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-bg/95 backdrop-blur-md border-b border-border-default"
          : "bg-bg/80 backdrop-blur-sm border-b border-transparent",
      )}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          <Link to="/">
            <Logo />
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <div key={link.label} className="relative">
                {link.dropdown ? (
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === link.label ? null : link.label)}
                    className={cn(
                      "flex items-center gap-1 px-3 py-2 text-[13px] font-medium rounded-md transition-colors",
                      activeDropdown === link.label || location.pathname.startsWith(link.href)
                        ? "text-text"
                        : "text-text-subtle hover:text-text",
                    )}
                  >
                    {link.label}
                    <ChevronDown size={13} className={cn("transition-transform", activeDropdown === link.label && "rotate-180")} />
                  </button>
                ) : (
                  <NavLink
                    to={link.href}
                    end={link.href === "/"}
                    className={({ isActive }) =>
                      cn(
                        "px-3 py-2 text-[13px] font-medium rounded-md transition-colors",
                        isActive ? "text-text" : "text-text-subtle hover:text-text",
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                )}

                {link.dropdown && activeDropdown === link.label && (
                  <div className="absolute left-0 top-full mt-2 w-72 rounded-lg border border-border-default bg-surface-2 p-2 shadow-xl">
                    {link.dropdown.map((d) => (
                      <Link
                        key={d.label}
                        to={d.href}
                        className="block rounded-md px-3 py-2 hover:bg-surface-3"
                      >
                        <p className="text-[13px] font-medium text-text">{d.label}</p>
                        <p className="text-[11.5px] text-text-subtle mt-0.5">{d.description}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <Link to="/login" className="px-3 py-1.5 text-[13px] text-text-muted hover:text-text">
              Log in
            </Link>
            <Link
              to="/signup"
              className="px-4 py-1.5 text-[13px] font-medium rounded-md bg-brand text-brand-foreground hover:bg-[#E55F15] transition-colors"
            >
              Get Started
            </Link>
          </div>

          <button
            className="lg:hidden h-9 w-9 grid place-items-center rounded-md border border-border-default text-text"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Open menu"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-border-default py-3">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                to={l.href}
                className="block px-3 py-2 text-[14px] text-text-muted hover:text-text"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2 px-3">
              <Link to="/login" className="flex-1 text-center px-3 py-2 text-[13px] border border-border-default rounded-md text-text">
                Log in
              </Link>
              <Link to="/signup" className="flex-1 text-center px-3 py-2 text-[13px] bg-brand text-brand-foreground rounded-md">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
