import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function FormField({ label, htmlFor, hint, error, required, children, className }: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-[12.5px] font-medium text-text-dim">
        {label}
        {required && <span className="ml-0.5 text-status-danger">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-[11.5px] text-text-subtle">{hint}</p>}
      {error && <p className="text-[11.5px] text-status-danger">{error}</p>}
    </div>
  );
}
