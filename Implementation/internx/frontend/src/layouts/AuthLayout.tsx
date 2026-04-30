import { Link, Outlet } from "react-router";
import { Logo } from "@/components/brand/Logo";

/**
 * AuthLayout — split-panel shell for /login and /signup routes.
 * Left panel: brand + stats (hidden on mobile). Right panel: form via <Outlet />.
 */
export default function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-bg text-foreground">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-surface-1 border-r border-border-subtle flex-col justify-between p-12 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(var(--text) 1px, transparent 1px), linear-gradient(90deg, var(--text) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-brand-2/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <Link to="/">
            <Logo size="lg" variant="graduation" />
          </Link>
        </div>

        <div className="relative max-w-md">
          <h2 className="text-[36px] font-bold leading-[1.15] tracking-tight text-text">
            The verified platform for student talent.
          </h2>
          <p className="mt-4 text-[15px] text-text-subtle leading-relaxed">
            12,400+ verified students. 8,200+ completed projects. 340+ partner universities worldwide.
          </p>

          <div className="mt-8 flex flex-col gap-4">
            <div className="rounded-2xl border border-border-subtle bg-surface-1 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-brand/20 border border-brand/30 grid place-items-center">
                  <span className="text-brand text-[11px] font-bold">JA</span>
                </div>
                <div>
                  <p className="text-[12.5px] font-semibold text-text">Jamie Allen</p>
                  <p className="text-[11px] text-text-subtle">Stanford CS '26</p>
                </div>
              </div>
              <p className="text-[12.5px] text-text-muted leading-relaxed">
                "Got my first paid project within a week of joining. The InternX rating system gave me real
                portfolio credibility."
              </p>
            </div>
          </div>
        </div>

        <p className="relative text-[11.5px] text-text-subtle">© 2026 InternX</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <Link to="/" className="lg:hidden absolute top-6 left-6">
          <Logo />
        </Link>
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
