import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Eye, EyeOff, ArrowRight, GraduationCap, Building2 } from "lucide-react";
import { FormField } from "@/components/forms/FormField";
import { PrimaryButton } from "@/components/forms/PrimaryButton";
import { useAuth } from "@/lib/auth/useAuth";
import { Input } from "@/components/ui/input";
import type { UserRole } from "@/types/user";

export default function Login() {
  const { loginAs } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };

  const [userType, setUserType] = useState<Exclude<UserRole, "admin">>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Mock auth — Phase 6 will wire to /api/auth/login
    loginAs(userType);
    const target = location.state?.from ?? `/dashboard/${userType}`;
    navigate(target, { replace: true });
  }

  return (
    <div>
      <div className="text-center">
        <h1 className="text-[28px] font-bold tracking-tight text-text">Welcome back</h1>
        <p className="mt-2 text-[13.5px] text-text-muted">Log in to continue to InternX.</p>
      </div>

      {/* Role toggle */}
      <div className="mt-7 grid grid-cols-2 gap-2 rounded-md border border-border-default bg-surface-2 p-1">
        {(["student", "business"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setUserType(t)}
            className={`flex items-center justify-center gap-2 rounded px-3 py-2 text-[12.5px] font-medium transition-colors ${
              userType === t ? "bg-brand text-brand-foreground" : "text-text-muted hover:text-text"
            }`}
          >
            {t === "student" ? <GraduationCap size={14} /> : <Building2 size={14} />}
            {t === "student" ? "Student" : "Business"}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <FormField label="Email" htmlFor="email" required>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={userType === "student" ? "you@university.edu" : "you@company.com"}
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
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-subtle hover:text-text"
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

        <PrimaryButton size="lg" className="w-full" icon={<ArrowRight size={15} />}>
          Log in as {userType === "student" ? "Student" : "Business"}
        </PrimaryButton>
      </form>

      <p className="mt-6 text-center text-[13px] text-text-muted">
        New to InternX?{" "}
        <Link to="/signup" className="text-brand hover:underline">Create an account</Link>
      </p>
    </div>
  );
}
