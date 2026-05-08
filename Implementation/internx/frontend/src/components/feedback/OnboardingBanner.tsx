import { Link } from "react-router";
import { AlertCircle, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth/useAuth";

interface Props {
  hideOnComplete?: boolean;
  variant?: "default" | "warning";
}

/**
 * Onboarding banner — shown to students with incomplete profiles. Links
 * to the setup page. No-op for businesses or completed students.
 */
export function OnboardingBanner({ variant = "default" }: Props) {
  const { user, profileComplete } = useAuth();
  if (!user || user.role !== "student" || profileComplete) return null;

  const tone =
    variant === "warning"
      ? "border-status-warning/30 bg-status-warning-soft text-status-warning"
      : "border-brand/30 bg-brand/10 text-brand";

  return (
    <div className={`mb-6 flex items-center justify-between gap-3 rounded-md border px-4 py-3 ${tone}`}>
      <div className="flex items-start gap-2">
        <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-[13px] font-semibold">Complete your profile to unlock platform features.</p>
          <p className="text-[11.5px] opacity-80 mt-0.5">
            Applications, messaging, and the project workspace are locked until your profile is finished.
          </p>
        </div>
      </div>
      <Link
        to="/dashboard/student/profile/setup"
        className="inline-flex items-center gap-1.5 rounded-md bg-brand px-3 py-1.5 text-[12.5px] font-medium text-brand-foreground hover:bg-[#E55F15] flex-shrink-0"
      >
        Complete setup <ArrowRight size={13} />
      </Link>
    </div>
  );
}
