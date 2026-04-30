import { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/components/forms/FormField";
import { PrimaryButton } from "@/components/forms/PrimaryButton";
import { GhostButton } from "@/components/forms/GhostButton";
import type { BusinessSignUpData } from "../BusinessSignUp";

interface Props {
  data: BusinessSignUpData;
  onChange: (patch: Partial<BusinessSignUpData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export interface Step2Errors {
  website?: string;
  category?: string;
}

export function validateStep2(data: BusinessSignUpData): Step2Errors {
  const errors: Step2Errors = {};
  if (!data.website.trim()) errors.website = "Company website is required";
  else if (!/^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i.test(data.website)) {
    errors.website = "Enter a valid website URL";
  }
  if (!data.category) errors.category = "Select a business category";
  return errors;
}

const CATEGORIES = [
  "Technology / SaaS",
  "E-commerce / Retail",
  "Finance / Fintech",
  "Healthcare / Medtech",
  "Education / EdTech",
  "Marketing / Advertising",
  "Media / Entertainment",
  "Manufacturing",
  "Consulting / Services",
  "Real Estate / Proptech",
  "Non-Profit",
  "Other",
];

export function BusinessSignUpStep2({ data, onChange, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<Step2Errors>({});

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validateStep2(data);
    setErrors(v);
    if (Object.keys(v).length === 0) onNext();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <h2 className="text-[18px] font-semibold tracking-tight text-text">Business Info</h2>
        <p className="mt-1 text-[12.5px] text-text-subtle">Tell us about your company.</p>
      </div>

      <FormField label="Company Website" required error={errors.website}>
        <Input
          value={data.website}
          onChange={(e) => onChange({ website: e.target.value })}
          placeholder="https://yourcompany.com"
        />
      </FormField>

      <FormField label="Business Category" required error={errors.category}>
        <Select
          value={data.category}
          onValueChange={(v) => onChange({ category: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <div className="flex gap-2 pt-2">
        <GhostButton type="button" size="lg" onClick={onBack} icon={<ArrowLeft size={15} />}>
          Back
        </GhostButton>
        <PrimaryButton size="lg" className="flex-1" icon={<ArrowRight size={15} />}>
          Continue
        </PrimaryButton>
      </div>
    </form>
  );
}
