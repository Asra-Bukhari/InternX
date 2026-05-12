import { useState } from "react";
import { AlertCircle, Upload, CheckCircle2, Loader } from "lucide-react";
import { Panel } from "@/components/forms/Panel";
import { PrimaryButton } from "@/components/forms/PrimaryButton";
import { GhostButton } from "@/components/forms/GhostButton";
import { FormField } from "@/components/forms/FormField";
import { deliverablesApi } from "@/lib/api/payments";
import { ApiError } from "@/lib/api/client";

interface Props {
  projectId: string;
  onSubmitted?: () => void;
}

export function DeliverableSubmissionForm({ projectId, onSubmitted }: Props) {
  const [fileUrl, setFileUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to cloud storage (S3, etc.)
      // For now, use file name as URL placeholder
      setFileUrl(file.name);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fileUrl.trim()) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload: { projectId: string; fileUrl: string } = {
        projectId,
        fileUrl: notes.trim() ? `${fileUrl} | Notes: ${notes.trim()}` : fileUrl,
      };
      await deliverablesApi.submit(payload);
      setSuccess(true);
      setFileUrl("");
      setNotes("");
      
      // Reset file input
      const fileInput = document.getElementById("deliverable-file") as HTMLInputElement | null;
      if (fileInput) fileInput.value = "";

      setTimeout(() => {
        setSuccess(false);
        onSubmitted?.();
      }, 2000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to submit deliverable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Panel padding="p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <FormField
          label="Upload file"
          hint="Select the deliverable file to submit"
          error={!notes && error ? error : undefined}
          required
        >
          <div className="flex items-center gap-2">
            <input
              type="file"
              id="deliverable-file"
              onChange={handleFileChange}
              disabled={loading}
              className="flex-1 text-[13px] file:mr-2 file:px-3 file:py-1.5 file:rounded-md file:border-0 file:text-[12px] file:font-medium file:bg-brand file:text-brand-foreground hover:file:bg-[#E55F15] disabled:opacity-60"
            />
          </div>
          {fileUrl && (
            <p className="text-[12px] text-text-muted mt-1">
              Selected: {fileUrl}
            </p>
          )}
        </FormField>

        <FormField label="Submission notes" hint="Optional notes for the business">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={loading}
            rows={3}
            placeholder="Describe what you've completed, any changes, etc."
            className="w-full resize-none rounded-md border border-border-default bg-surface-1 px-3 py-2 text-[13px] text-text placeholder:text-text-subtle outline-none focus:border-brand"
          />
        </FormField>

        {error && (
          <div className="flex items-start gap-2 rounded-md border border-status-danger/30 bg-status-danger-soft px-3 py-2.5 text-[12.5px] text-status-danger">
            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-2 rounded-md border border-status-success/30 bg-status-success-soft px-3 py-2.5 text-[12.5px] text-status-success">
            <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" />
            <span>Deliverable submitted successfully!</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-1">
          <GhostButton
            type="button"
            size="sm"
            onClick={() => {
              setFileUrl("");
              setNotes("");
              setError(null);
              const fileInput = document.getElementById("deliverable-file") as HTMLInputElement | null;
              if (fileInput) fileInput.value = "";
            }}
            disabled={loading || (!fileUrl && !notes)}
          >
            Clear
          </GhostButton>
          <PrimaryButton
            type="submit"
            size="sm"
            disabled={loading || !fileUrl}
            icon={loading ? <Loader size={13} className="animate-spin" /> : <Upload size={13} />}
          >
            {loading ? "Submitting…" : "Submit Deliverable"}
          </PrimaryButton>
        </div>
      </form>
    </Panel>
  );
}
