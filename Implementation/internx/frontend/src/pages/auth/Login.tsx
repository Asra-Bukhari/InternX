import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { FormField } from "@/components/forms/FormField";
import { PrimaryButton } from "@/components/forms/PrimaryButton";
import { useAuth } from "@/lib/auth/useAuth";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api/client";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function dashboardFor(role: string): string {
    if (role === "business") return "/dashboard/business";
    if (role === "admin") return "/dashboard/business";
    return "/dashboard/student";
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setError(null);

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    setSubmitting(true);
    try {
      const user = await login({ email: email.trim(), password });
      const target = location.state?.from && location.state.from !== "/login"
        ? location.state.from
        : dashboardFor(user.role);
      navigate(target, { replace: true });
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : "Login failed. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="text-center">
        <h1 className="text-[28px] font-bold tracking-tight text-text">Welcome back</h1>
        <p className="mt-2 text-[13.5px] text-text-muted">Log in to continue to InternX.</p>
      </div>

      {error && (
        <div className="mt-6 flex items-start gap-2 rounded-md border border-status-danger/30 bg-status-danger-soft px-3 py-2.5 text-[12.5px] text-status-danger">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <FormField label="Email" htmlFor="email" required>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </FormField>

        <FormField label="Password" htmlFor="password" required>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-subtle hover:text-text"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </FormField>

        <div className="flex items-center justify-between text-[12.5px]">
          <label className="flex items-center gap-2 text-text-muted">
            <input type="checkbox" className="accent-[var(--brand)]" />
            Remember me
          </label>
          <Link to="#" className="text-brand hover:underline">Forgot password?</Link>
        </div>

        <PrimaryButton size="lg" className="w-full" icon={<ArrowRight size={15} />} disabled={submitting}>
          {submitting ? "Logging in…" : "Log in"}
        </PrimaryButton>
      </form>

      <p className="mt-6 text-center text-[13px] text-text-muted">
        New to InternX?{" "}
        <Link to="/signup" className="text-brand hover:underline">Create an account</Link>
      </p>
    </div>
  );
}
