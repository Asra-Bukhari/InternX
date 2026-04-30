import { useState } from "react";
import { ArrowLeft, GraduationCap } from "lucide-react";
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
import type { StudentSignUpData } from "../StudentSignUp";

interface Props {
  data: StudentSignUpData;
  onChange: (patch: Partial<StudentSignUpData>) => void;
  onSubmit: () => void;
  onBack: () => void;
  submitting?: boolean;
}

export interface Step3Errors {
  degreeLevel?: string;
  degreeProgram?: string;
  university?: string;
  semester?: string;
  graduationYear?: string;
}

export function validateStep3(data: StudentSignUpData): Step3Errors {
  const errors: Step3Errors = {};
  if (!data.degreeLevel) errors.degreeLevel = "Select a degree level";
  if (!data.degreeProgram.trim()) errors.degreeProgram = "Degree program is required";
  if (!data.university.trim()) errors.university = "University name is required";
  if (!data.semester.trim()) errors.semester = "Current semester is required";
  if (!data.graduationYear.trim()) errors.graduationYear = "Expected graduation year is required";
  else if (!/^\d{4}$/.test(data.graduationYear)) errors.graduationYear = "Enter a valid 4-digit year";
  return errors;
}

const DEGREE_LEVELS = [
  "Bachelor's",
  "Master's",
  "PhD / Doctorate",
  "Associate's",
  "Diploma",
  "Other",
];

export function StudentSignUpStep3({ data, onChange, onSubmit, onBack, submitting }: Props) {
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
        <h2 className="text-[18px] font-semibold tracking-tight text-text">Academic Information</h2>
        <p className="mt-1 text-[12.5px] text-text-subtle">Tell us about your studies.</p>
      </div>

      <FormField label="Degree Level" required error={errors.degreeLevel}>
        <Select
          value={data.degreeLevel}
          onValueChange={(v) => onChange({ degreeLevel: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select degree level" />
          </SelectTrigger>
          <SelectContent>
            {DEGREE_LEVELS.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField label="Degree Program" required error={errors.degreeProgram}>
        <Input
          value={data.degreeProgram}
          onChange={(e) => onChange({ degreeProgram: e.target.value })}
          placeholder="e.g. Computer Science"
        />
      </FormField>

      <FormField label="University Name" required error={errors.university}>
        <Input
          value={data.university}
          onChange={(e) => onChange({ university: e.target.value })}
          placeholder="e.g. IIT Delhi"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Current Semester" required error={errors.semester}>
          <Input
            value={data.semester}
            onChange={(e) => onChange({ semester: e.target.value })}
            placeholder="e.g. 5th"
          />
        </FormField>
        <FormField label="Expected Graduation" required error={errors.graduationYear}>
          <Input
            inputMode="numeric"
            maxLength={4}
            value={data.graduationYear}
            onChange={(e) => onChange({ graduationYear: e.target.value.replace(/\D/g, "") })}
            placeholder="2027"
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
          icon={<GraduationCap size={15} />}
          disabled={submitting}
        >
          {submitting ? "Creating account…" : "Create Student Account"}
        </PrimaryButton>
      </div>
    </form>
  );
}
