import { useEffect, useState } from "react";
import { Mail, Building2, AlertCircle, CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/forms/PageShell";
import { Panel } from "@/components/forms/Panel";
import { FormField } from "@/components/forms/FormField";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GhostButton } from "@/components/forms/GhostButton";
import { PrimaryButton } from "@/components/forms/PrimaryButton";
import { useAuth } from "@/lib/auth/useAuth";
import { profileApi } from "@/lib/api/profile";
import { ApiError } from "@/lib/api/client";

/**
 * Backend Profile model is currently student-shaped. Until a BusinessProfile
 * model / endpoints exist, we surface the User account fields and persist
 * a free-form "About" string into Profile.degree (best available text field)
 * so the data round-trips. Website / category remain local until the backend
 * adds storage for them.
 */
export default function BusinessProfile() {
  const { user, profile, refreshProfile } = useAuth();

  const [companyName, setCompanyName] = useState("");
  const [about, setAbout] = useState("");
  const [website, setWebsite] = useState("");
  const [category, setCategory] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) setCompanyName(user.name);
    if (profile) setAbout(profile.cleanDegree ?? "");
  }, [user, profile]);

  async function onSave() {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await profileApi.updateRaw({
        degree: about || undefined,
      });
      await refreshProfile();
      setSuccess("Profile updated.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save profile.");
    } finally {
      setSaving(false);
    }
  }

  if (!user) return null;
  const initials = user.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  return (
    <PageShell
      title="Company Profile"
      subtitle="Manage your public business profile"
      actions={
        <>
          <GhostButton size="md" disabled={saving}>Cancel</GhostButton>
          <PrimaryButton size="md" onClick={onSave} disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </PrimaryButton>
        </>
      }
    >
      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-md border border-status-danger/30 bg-status-danger-soft px-3 py-2.5 text-[12.5px] text-status-danger">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="mb-4 flex items-start gap-2 rounded-md border border-status-success/30 bg-status-success-soft px-3 py-2.5 text-[12.5px] text-status-success">
          <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <Panel padding="p-6" className="lg:col-span-1">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-lg bg-brand/15 text-[20px] font-semibold text-brand">
              {initials}
            </div>
            <div>
              <h2 className="text-[18px] font-semibold text-text">{user.name}</h2>
              <p className="text-[12.5px] text-text-subtle">
                {user.isVerified ? "Verified Business" : "Business Account"}
              </p>
            </div>
          </div>
          <div className="mt-6 space-y-3 text-[13px]">
            <div className="flex items-center gap-2 text-text-muted"><Mail size={13}/> {user.email}</div>
            <div className="flex items-center gap-2 text-text-muted"><Building2 size={13}/> {category || "Category —"}</div>
          </div>
        </Panel>

        <Panel padding="p-6" className="lg:col-span-2">
          <h3 className="text-[15px] font-semibold text-text mb-4">Edit profile</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Company name">
              <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </FormField>
            <FormField label="Email">
              <Input value={user.email} type="email" disabled />
            </FormField>
            <FormField label="Website" hint="Local-only until backend support">
              <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." />
            </FormField>
            <FormField label="Category" hint="Local-only until backend support">
              <Input value={category} onChange={(e) => setCategory(e.target.value)} />
            </FormField>
          </div>

          <FormField label="About" className="mt-4" hint="Shown to students viewing your projects">
            <Textarea
              rows={5}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />
          </FormField>
        </Panel>
      </div>
    </PageShell>
  );
}
