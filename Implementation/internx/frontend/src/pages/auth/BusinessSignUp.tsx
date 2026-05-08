import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { AlertCircle } from "lucide-react";
import { StepIndicator } from "@/components/forms/StepIndicator";
import { useAuth } from "@/lib/auth/useAuth";
import { ApiError } from "@/lib/api/client";
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
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [data, setData] = useState<BusinessSignUpData>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function patch(p: Partial<BusinessSignUpData>) {
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
      // Backend has no business-info or payment endpoints yet.
      // We only register the account; website/category/card data is collected
      // on the client and will be persisted once those endpoints exist.
      await register({
        name: data.companyName.trim(),
        email: data.email.trim(),
        password: data.password,
        role: "business",
      });
      navigate("/dashboard/business", { replace: true });
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : "Could not create account. Please try again.";
      setError(msg);
      setStep(1);
    } finally {
      setSubmitting(false);
    }
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

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-md border border-status-danger/30 bg-status-danger-soft px-3 py-2.5 text-[12.5px] text-status-danger">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

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
