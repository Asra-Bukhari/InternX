import { Link } from "react-router";
import { Logo } from "@/components/brand/Logo";

const FOOTER_NAV = [
  {
    title: "Platform",
    links: [
      { label: "How It Works", href: "/how-it-works" },
      { label: "Why InternX", href: "/why-resume" },
      { label: "Pricing", href: "/pricing" },
      { label: "Universities", href: "/universities" },
    ],
  },
  {
    title: "For Students",
    links: [
      { label: "Sign Up", href: "/signup/student" },
      { label: "Browse Projects", href: "/dashboard/student/projects" },
      { label: "Levels & Perks", href: "/dashboard/student/levels" },
    ],
  },
  {
    title: "For Businesses",
    links: [
      { label: "Sign Up", href: "/signup/business" },
      { label: "Post a Project", href: "/dashboard/business/projects/new" },
      { label: "Hire Talent", href: "/dashboard/business" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-surface-1">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p className="mt-3 text-[12.5px] text-text-subtle leading-relaxed max-w-[220px]">
              The verified platform for student talent and the businesses that hire them.
            </p>
          </div>

          {FOOTER_NAV.map((col) => (
            <div key={col.title}>
              <h4 className="text-[12px] font-semibold uppercase tracking-wider text-text">{col.title}</h4>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.href} className="text-[13px] text-text-subtle hover:text-text">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-border-subtle flex flex-col md:flex-row items-center justify-between gap-2 text-[11.5px] text-text-subtle">
          <p>© 2026 InternX. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="#" className="hover:text-text">Privacy</Link>
            <Link to="#" className="hover:text-text">Terms</Link>
            <Link to="#" className="hover:text-text">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
