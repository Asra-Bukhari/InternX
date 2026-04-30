import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { StepIndicator } from "@/components/forms/StepIndicator";
import { useAuth } from "@/lib/auth/useAuth";
import { BusinessSignUpStep1 } from "./business-signup/Step1Account";
import { BusinessSignUpStep2 } from "./business-signup/Step2Info";
import { BusinessSignUpStep3 } from "./business-signup/Step3Payment";

export interface BusinessSignUpData {
  // Step 1
  companyName: string;
  email: string;
  password: string;
  confirmPassword: string;
  // Step 2
  website: string;
  category: string;
  // Step 3
  cardHolder: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

const INITIAL: BusinessSignUpData = {
  companyName: "",
  email: "",
  password: "",
  confirmPassword: "",
  website: "",
  category: "",
  cardHolder: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
};

const STEP_LABELS = ["Account", "Business Info", "Payment"];

export default function BusinessSignUp() {
  const { loginAs } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [data, setData] = useState<BusinessSignUpData>(INITIAL);
  const [submitting, setSubmitting] = useState(false);

  function patch(p: Partial<BusinessSignUpData>) {
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
    // Phase 6 will replace this with: await api.auth.registerBusiness(data)
    loginAs("business");
    navigate("/dashboard/business", { replace: true });
  }

  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-[26px] font-bold tracking-tight text-text">Create your business account</h1>
        <p className="mt-1.5 text-[13px] text-text-muted">Hire verified student talent on InternX.</p>
      </div>

      <div className="mb-6">
        <StepIndicator current={step} total={3} labels={STEP_LABELS} />
      </div>

      {step === 1 && <BusinessSignUpStep1 data={data} onChange={patch} onNext={next} />}
      {step === 2 && <BusinessSignUpStep2 data={data} onChange={patch} onNext={next} onBack={back} />}
      {step === 3 && (
        <BusinessSignUpStep3
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
