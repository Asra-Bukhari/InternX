import { useState, useRef } from "react";
import { ArrowRight, ArrowLeft, Mail, FileUp, Upload, X, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/forms/FormField";
import { PrimaryButton } from "@/components/forms/PrimaryButton";
import { GhostButton } from "@/components/forms/GhostButton";
import type { StudentSignUpData, VerificationMethod } from "../StudentSignUp";
import { cn } from "@/lib/utils/cn";

interface Props {
  data: StudentSignUpData;
  onChange: (patch: Partial<StudentSignUpData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export interface Step2Errors {
  universityEmail?: string;
  verificationCode?: string;
  studentIdFile?: string;
}

export function validateStep2(data: StudentSignUpData): Step2Errors {
  const errors: Step2Errors = {};
  if (data.verificationMethod === "email") {
    if (!data.universityEmail.trim()) {
      errors.universityEmail = "University email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.universityEmail)) {
      errors.universityEmail = "Enter a valid email";
    } else if (!/\.(edu|ac\.[a-z]{2,}|edu\.[a-z]{2,})$/i.test(data.universityEmail)) {
      errors.universityEmail = "Use a valid university email (.edu or .ac domain)";
    }
    if (data.codeSent && !data.verificationCode.trim()) {
      errors.verificationCode = "Enter the verification code";
    }
  } else {
    if (!data.studentIdFile) {
      errors.studentIdFile = "Please upload your student ID";
    }
  }
  return errors;
}

export function StudentSignUpStep2({ data, onChange, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<Step2Errors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  function setMethod(method: VerificationMethod) {
    onChange({ verificationMethod: method });
    setErrors({});
  }

  function sendCode() {
    if (!data.universityEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.universityEmail)) {
      setErrors({ universityEmail: "Enter a valid university email first" });
      return;
    }
    onChange({ codeSent: true });
    setErrors({});
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange({ studentIdFile: file });
    setErrors({});
  }

  function clearFile() {
    onChange({ studentIdFile: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validateStep2(data);
    setErrors(v);
    if (Object.keys(v).length === 0) onNext();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <h2 className="text-[18px] font-semibold tracking-tight text-text">Student Verification</h2>
        <p className="mt-1 text-[12.5px] text-text-subtle">Verify your enrollment to continue.</p>
      </div>

      {/* Method toggle */}
      <div className="grid grid-cols-2 gap-2 rounded-md border border-border-default bg-surface-2 p-1">
        <button
          type="button"
          onClick={() => setMethod("email")}
          className={cn(
            "flex items-center justify-center gap-2 rounded px-3 py-2 text-[12.5px] font-medium transition-colors",
            data.verificationMethod === "email"
              ? "bg-brand text-brand-foreground"
              : "text-text-muted hover:text-text",
          )}
        >
          <Mail size={14} />
          University Email
        </button>
        <button
          type="button"
          onClick={() => setMethod("id")}
          className={cn(
            "flex items-center justify-center gap-2 rounded px-3 py-2 text-[12.5px] font-medium transition-colors",
            data.verificationMethod === "id"
              ? "bg-brand text-brand-foreground"
              : "text-text-muted hover:text-text",
          )}
        >
          <FileUp size={14} />
          Student ID
        </button>
      </div>

      {data.verificationMethod === "email" ? (
        <>
          <FormField
            label="University Email"
            required
            error={errors.universityEmail}
            hint={!errors.universityEmail ? "Must end with .edu or your university's domain" : undefined}
          >
            <Input
              type="email"
              value={data.universityEmail}
              onChange={(e) => onChange({ universityEmail: e.target.value, codeSent: false })}
              placeholder="you@university.edu"
              disabled={data.codeSent}
            />
          </FormField>

          {!data.codeSent ? (
            <GhostButton type="button" size="md" className="w-full" onClick={sendCode}>
              Send Verification Code
            </GhostButton>
          ) : (
            <>
              <div className="flex items-start gap-2 rounded-md border border-status-success/30 bg-status-success-soft px-3 py-2.5 text-[12.5px] text-status-success">
                <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" />
                <span>Code sent to {data.universityEmail}. Check your inbox.</span>
              </div>
              <FormField label="Verification Code" required error={errors.verificationCode}>
                <Input
                  value={data.verificationCode}
                  onChange={(e) => onChange({ verificationCode: e.target.value })}
                  placeholder="6-digit code"
                  maxLength={6}
                />
              </FormField>
              <button
                type="button"
                onClick={() => onChange({ codeSent: false, verificationCode: "" })}
                className="text-[12px] text-brand hover:underline"
              >
                Use a different email
              </button>
            </>
          )}
        </>
      ) : (
        <FormField
          label="Student ID"
          required
          error={errors.studentIdFile}
          hint={!errors.studentIdFile ? "Upload a clear photo of your current student ID (PNG, JPG, PDF, max 5MB)" : undefined}
        >
          {data.studentIdFile ? (
            <div className="flex items-center justify-between gap-3 rounded-md border border-border-default bg-surface-2 px-3 py-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle2 size={16} className="text-status-success flex-shrink-0" />
                <span className="text-[13px] text-text truncate">{data.studentIdFile.name}</span>
                <span className="text-[11px] text-text-subtle flex-shrink-0">
                  {(data.studentIdFile.size / 1024).toFixed(0)} KB
                </span>
              </div>
              <button
                type="button"
                onClick={clearFile}
                className="text-text-subtle hover:text-text flex-shrink-0"
                aria-label="Remove file"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border-strong bg-surface-2 px-4 py-8 text-text-muted hover:border-brand/50 hover:bg-surface-3 transition-colors"
            >
              <Upload size={20} />
              <span className="text-[13px] font-medium text-text">Click to upload</span>
              <span className="text-[11.5px] text-text-subtle">PNG, JPG, or PDF · Max 5MB</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,application/pdf"
            className="hidden"
            onChange={onFile}
          />
        </FormField>
      )}

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
