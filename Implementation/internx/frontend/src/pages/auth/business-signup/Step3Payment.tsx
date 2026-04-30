import { useState } from "react";
import { ArrowLeft, Building2, Lock, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/forms/FormField";
import { PrimaryButton } from "@/components/forms/PrimaryButton";
import { GhostButton } from "@/components/forms/GhostButton";
import type { BusinessSignUpData } from "../BusinessSignUp";

interface Props {
  data: BusinessSignUpData;
  onChange: (patch: Partial<BusinessSignUpData>) => void;
  onSubmit: () => void;
  onBack: () => void;
  submitting?: boolean;
}

export interface Step3Errors {
  cardHolder?: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
}

function digitsOnly(s: string) {
  return s.replace(/\D/g, "");
}

function formatCardNumber(s: string) {
  return digitsOnly(s).slice(0, 19).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(s: string) {
  const d = digitsOnly(s).slice(0, 4);
  if (d.length < 3) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
}

export function validateStep3(data: BusinessSignUpData): Step3Errors {
  const errors: Step3Errors = {};
  if (!data.cardHolder.trim()) errors.cardHolder = "Card holder name is required";

  const cardDigits = digitsOnly(data.cardNumber);
  if (!cardDigits) errors.cardNumber = "Card number is required";
  else if (cardDigits.length < 13 || cardDigits.length > 19) errors.cardNumber = "Enter a valid card number";

  if (!data.expiry.trim()) errors.expiry = "Expiry date is required";
  else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.expiry)) errors.expiry = "Use MM/YY format";
  else {
    const [mm, yy] = data.expiry.split("/").map(Number);
    const now = new Date();
    const expiryDate = new Date(2000 + yy, mm - 1, 1);
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    if (expiryDate <= now) errors.expiry = "Card is expired";
  }

  if (!data.cvv.trim()) errors.cvv = "CVV is required";
  else if (!/^\d{3,4}$/.test(data.cvv)) errors.cvv = "CVV must be 3 or 4 digits";

  return errors;
}

export function BusinessSignUpStep3({ data, onChange, onSubmit, onBack, submitting }: Props) {
  const [errors, setErrors] = useState<Step3Errors>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validateStep3(data);
    setErrors(v);
    if (Object.keys(v).length === 0) onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-[18px] font-semibold tracking-tight text-text">Payment Verification</h2>
        <p className="mt-1 text-[12.5px] text-text-subtle">
          We verify your card to prevent fraud. You won't be charged.
        </p>
      </div>

      <div className="flex items-start gap-2 rounded-md border border-border-subtle bg-surface-2 px-3 py-2.5 text-[12px] text-text-muted">
        <Lock size={14} className="mt-0.5 flex-shrink-0 text-status-success" />
        <span>Card details are encrypted in transit and processed by our payment provider.</span>
      </div>

      <FormField label="Card Holder Name" required error={errors.cardHolder}>
        <Input
          value={data.cardHolder}
          onChange={(e) => onChange({ cardHolder: e.target.value })}
          placeholder="As shown on card"
          autoComplete="cc-name"
        />
      </FormField>

      <FormField label="Card Number" required error={errors.cardNumber}>
        <div className="relative">
          <Input
            inputMode="numeric"
            value={data.cardNumber}
            onChange={(e) => onChange({ cardNumber: formatCardNumber(e.target.value) })}
            placeholder="1234 5678 9012 3456"
            autoComplete="cc-number"
            className="pl-10"
          />
          <CreditCard
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle"
          />
        </div>
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Expiry Date" required error={errors.expiry}>
          <Input
            inputMode="numeric"
            value={data.expiry}
            onChange={(e) => onChange({ expiry: formatExpiry(e.target.value) })}
            placeholder="MM/YY"
            maxLength={5}
            autoComplete="cc-exp"
          />
        </FormField>
        <FormField label="CVV" required error={errors.cvv}>
          <Input
            inputMode="numeric"
            value={data.cvv}
            onChange={(e) => onChange({ cvv: digitsOnly(e.target.value).slice(0, 4) })}
            placeholder="123"
            maxLength={4}
            autoComplete="cc-csc"
          />
        </FormField>
      </div>

      <div className="flex gap-2 pt-2">
        <GhostButton type="button" size="lg" onClick={onBack} icon={<ArrowLeft size={15} />} disabled={submitting}>
          Back
        </GhostButton>
        <PrimaryButton
          size="lg"
          className="flex-1"
          icon={<Building2 size={15} />}
          disabled={submitting}
        >
          {submitting ? "Creating account…" : "Create Business Account"}
        </PrimaryButton>
      </div>
    </form>
  );
}
