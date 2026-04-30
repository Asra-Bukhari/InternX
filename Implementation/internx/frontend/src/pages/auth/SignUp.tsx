import { Link } from "react-router";
import { GraduationCap, Building2, ArrowRight } from "lucide-react";
import { Panel } from "@/components/forms/Panel";

export default function SignUp() {
  return (
    <div>
      <div className="text-center">
        <h1 className="text-[28px] font-bold tracking-tight text-text">Join InternX</h1>
        <p className="mt-2 text-[13.5px] text-text-muted">Choose your account type to get started.</p>
      </div>

      <div className="mt-8 space-y-3">
        <Link to="/signup/student" className="block">
          <Panel hover padding="p-5">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-brand/15 text-brand">
                <GraduationCap size={22} />
              </div>
              <div className="flex-1">
                <h2 className="text-[15px] font-semibold text-text">I'm a Student</h2>
                <p className="text-[12.5px] text-text-muted">Apply to projects, build a portfolio, get paid.</p>
              </div>
              <ArrowRight size={16} className="text-text-subtle" />
            </div>
          </Panel>
        </Link>

        <Link to="/signup/business" className="block">
          <Panel hover padding="p-5">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-brand/15 text-brand">
                <Building2 size={22} />
              </div>
              <div className="flex-1">
                <h2 className="text-[15px] font-semibold text-text">I'm a Business</h2>
                <p className="text-[12.5px] text-text-muted">Post projects, hire verified students, ship work.</p>
              </div>
              <ArrowRight size={16} className="text-text-subtle" />
            </div>
          </Panel>
        </Link>
      </div>

      <p className="mt-6 text-center text-[13px] text-text-muted">
        Already have an account?{" "}
        <Link to="/login" className="text-brand hover:underline">Log in</Link>
      </p>
    </div>
  );
}
