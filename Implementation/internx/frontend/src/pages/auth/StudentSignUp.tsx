import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { StepIndicator } from "@/components/forms/StepIndicator";
import { useAuth } from "@/lib/auth/useAuth";
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
  const { loginAs } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [data, setData] = useState<StudentSignUpData>(INITIAL);
  const [submitting, setSubmitting] = useState(false);

  function patch(p: Partial<StudentSignUpData>) {
    setData((d) => ({ ...d, ...p }));
  }

  function next() {
    setStep((s) => (s < 3 ? ((s + 1) as 1 | 2 | 3) : s));
  }
  function back() {
    setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3) : s));
  }

  function submit() {
    setSubmitting(true);
    // Phase 6 will replace this with: await api.auth.registerStudent(data)
    loginAs("student");
    navigate("/dashboard/student", { replace: true });
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
