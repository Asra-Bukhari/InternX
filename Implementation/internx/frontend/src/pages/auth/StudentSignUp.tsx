import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { AlertCircle } from "lucide-react";
import { StepIndicator } from "@/components/forms/StepIndicator";
import { useAuth } from "@/lib/auth/useAuth";
import { profileApi } from "@/lib/api/profile";
import { ApiError } from "@/lib/api/client";
import { StudentSignUpStep1 } from "./student-signup/Step1Account";
import { StudentSignUpStep2 } from "./student-signup/Step2Verification";
import { StudentSignUpStep3 } from "./student-signup/Step3Academic";

export type VerificationMethod = "email" | "id";

export interface StudentSignUpData {
  // Step 1
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  // Step 2
  verificationMethod: VerificationMethod;
  universityEmail: string;
  codeSent: boolean;
  verificationCode: string;
  studentIdFile: File | null;
  // Step 3
  degreeLevel: string;
  degreeProgram: string;
  university: string;
  semester: string;
  graduationYear: string;
}

const INITIAL: StudentSignUpData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  verificationMethod: "email",
  universityEmail: "",
  codeSent: false,
  verificationCode: "",
  studentIdFile: null,
  degreeLevel: "",
  degreeProgram: "",
  university: "",
  semester: "",
  graduationYear: "",
};

const STEP_LABELS = ["Account", "Verification", "Academic"];

export default function StudentSignUp() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [data, setData] = useState<StudentSignUpData>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function patch(p: Partial<StudentSignUpData>) {
    setData((d) => ({ ...d, ...p }));
  }

  function next() {
    setError(null);
    setStep((s) => (s < 3 ? ((s + 1) as 1 | 2 | 3) : s));
  }
  function back() {
    setError(null);
    setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3) : s));
  }

  async function submit() {
    setError(null);
    setSubmitting(true);
    try {
      // 1) Register the student account
      await register({
        name: `${data.firstName.trim()} ${data.lastName.trim()}`.trim(),
        email: data.email.trim(),
        password: data.password,
        role: "student",
      });

      // 2) Persist academic info to the profile
      try {
        await profileApi.updateRaw({
          university: data.university,
          semester: data.semester,
        });
      } catch {
        /* profile update is non-fatal — user completes setup later */
      }

      navigate("/dashboard/student", { replace: true });
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : "Could not create account. Please try again.";
      setError(msg);
      setStep(1); // surface conflicts (e.g. email taken) on Step 1
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-[26px] font-bold tracking-tight text-text">Create your student account</h1>
        <p className="mt-1.5 text-[13px] text-text-muted">Join verified university talent on InternX.</p>
      </div>

      <div className="mb-6">
        <StepIndicator current={step} total={3} labels={STEP_LABELS} />
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-md border border-status-danger/30 bg-status-danger-soft px-3 py-2.5 text-[12.5px] text-status-danger">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {step === 1 && <StudentSignUpStep1 data={data} onChange={patch} onNext={next} />}
      {step === 2 && <StudentSignUpStep2 data={data} onChange={patch} onNext={next} onBack={back} />}
      {step === 3 && (
        <StudentSignUpStep3
          data={data}
          onChange={patch}
          onSubmit={submit}
          onBack={back}
          submitting={submitting}
        />
      )}

      <p className="mt-6 text-center text-[13px] text-text-muted">
        Already have an account?{" "}
        <Link to="/login" className="text-brand hover:underline">Log in</Link>
      </p>
    </div>
  );
}
