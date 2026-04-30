import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/forms/FormField";
import { PrimaryButton } from "@/components/forms/PrimaryButton";
import type { StudentSignUpData } from "../StudentSignUp";

interface Props {
  data: StudentSignUpData;
  onChange: (patch: Partial<StudentSignUpData>) => void;
  onNext: () => void;
}

export interface Step1Errors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function validateStep1(data: StudentSignUpData): Step1Errors {
  const errors: Step1Errors = {};
  if (!data.firstName.trim()) errors.firstName = "First name is required";
  if (!data.lastName.trim()) errors.lastName = "Last name is required";
  if (!data.email.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Enter a valid email";
  if (!data.password) errors.password = "Password is required";
  else if (data.password.length < 8) errors.password = "Password must be at least 8 characters";
  if (!data.confirmPassword) errors.confirmPassword = "Please confirm your password";
  else if (data.password !== data.confirmPassword) errors.confirmPassword = "Passwords do not match";
  return errors;
}

export function StudentSignUpStep1({ data, onChange, onNext }: Props) {
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
        <h2 className="text-[18px] font-semibold tracking-tight text-text">Basic Account Setup</h2>
        <p className="mt-1 text-[12.5px] text-text-subtle">Tell us who you are.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="First Name" required error={errors.firstName}>
          <Input
            value={data.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
            placeholder="Aarav"
          />
        </FormField>
        <FormField label="Last Name" required error={errors.lastName}>
          <Input
            value={data.lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
            placeholder="Sharma"
          />
        </FormField>
      </div>

      <FormField label="Email" required error={errors.email}>
        <Input
          type="email"
          value={data.email}
          onChange={(e) => onChange({ email: e.target.value })}
          placeholder="you@example.com"
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
