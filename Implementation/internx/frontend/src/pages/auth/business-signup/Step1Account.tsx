import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/forms/FormField";
import { PrimaryButton } from "@/components/forms/PrimaryButton";
import type { BusinessSignUpData } from "../BusinessSignUp";

interface Props {
  data: BusinessSignUpData;
  onChange: (patch: Partial<BusinessSignUpData>) => void;
  onNext: () => void;
}

export interface Step1Errors {
  companyName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function validateStep1(data: BusinessSignUpData): Step1Errors {
  const errors: Step1Errors = {};
  if (!data.companyName.trim()) errors.companyName = "Company name is required";
  if (!data.email.trim()) errors.email = "Business email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Enter a valid email";
  if (!data.password) errors.password = "Password is required";
  else if (data.password.length < 8) errors.password = "Password must be at least 8 characters";
  if (!data.confirmPassword) errors.confirmPassword = "Please confirm your password";
  else if (data.password !== data.confirmPassword) errors.confirmPassword = "Passwords do not match";
  return errors;
}

export function BusinessSignUpStep1({ data, onChange, onNext }: Props) {
  const [errors, setErrors] = useState<Step1Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validateStep1(data);
    setErrors(v);
    if (Object.keys(v).length === 0) onNext();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <h2 className="text-[18px] font-semibold tracking-tight text-text">Company Account Setup</h2>
        <p className="mt-1 text-[12.5px] text-text-subtle">Create your business credentials.</p>
      </div>

      <FormField label="Company Name" required error={errors.companyName}>
        <Input
          value={data.companyName}
          onChange={(e) => onChange({ companyName: e.target.value })}
          placeholder="TechCraft Ltd."
        />
      </FormField>

      <FormField label="Business Email" required error={errors.email}>
        <Input
          type="email"
          value={data.email}
          onChange={(e) => onChange({ email: e.target.value })}
          placeholder="you@company.com"
        />
      </FormField>

      <FormField
        label="Password"
        required
        error={errors.password}
        hint={!errors.password ? "Minimum 8 characters" : undefined}
      >
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            value={data.password}
            onChange={(e) => onChange({ password: e.target.value })}
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

      <FormField label="Confirm Password" required error={errors.confirmPassword}>
        <div className="relative">
          <Input
            type={showConfirm ? "text" : "password"}
            value={data.confirmPassword}
            onChange={(e) => onChange({ confirmPassword: e.target.value })}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-subtle hover:text-text"
            tabIndex={-1}
          >
            {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </FormField>

      <PrimaryButton size="lg" className="w-full mt-2" icon={<ArrowRight size={15} />}>
        Continue
      </PrimaryButton>
    </form>
  );
}
