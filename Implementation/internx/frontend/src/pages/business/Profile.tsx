import { Mail, Building2, Calendar, Globe, Briefcase } from "lucide-react";
import { PageShell } from "@/components/forms/PageShell";
import { Panel } from "@/components/forms/Panel";
import { FormField } from "@/components/forms/FormField";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GhostButton } from "@/components/forms/GhostButton";
import { PrimaryButton } from "@/components/forms/PrimaryButton";
import { KPIStat } from "@/components/domain/KPIStat";
import { BUSINESS } from "@/lib/mock/business";

export default function BusinessProfile() {
  return (
    <PageShell
      title="Company Profile"
      subtitle="Manage your public business profile"
      actions={<><GhostButton size="md">Cancel</GhostButton><PrimaryButton size="md">Save changes</PrimaryButton></>}
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <Panel padding="p-6" className="lg:col-span-1">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-lg bg-brand/15 text-[20px] font-semibold text-brand">
              {BUSINESS.initials}
            </div>
            <div>
              <h2 className="text-[18px] font-semibold text-text">{BUSINESS.company}</h2>
              <p className="text-[12.5px] text-text-subtle">{BUSINESS.industry} · {BUSINESS.size} employees</p>
            </div>
          </div>
          <div className="mt-6 space-y-3 text-[13px]">
            <div className="flex items-center gap-2 text-text-muted"><Mail size={13}/> {BUSINESS.email}</div>
            <div className="flex items-center gap-2 text-text-muted"><Globe size={13}/> {BUSINESS.website}</div>
            <div className="flex items-center gap-2 text-text-muted"><Calendar size={13}/> Founded {BUSINESS.founded}</div>
            <div className="flex items-center gap-2 text-text-muted"><Building2 size={13}/> {BUSINESS.size} team</div>
            <div className="flex items-center gap-2 text-text-muted"><Briefcase size={13}/> Contact: {BUSINESS.name}</div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <KPIStat label="Active" value={BUSINESS.activeProjects} />
            <KPIStat label="Done" value={BUSINESS.completedProjects} />
          </div>
        </Panel>

        <Panel padding="p-6" className="lg:col-span-2">
          <h3 className="text-[15px] font-semibold text-text mb-4">Edit profile</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Company name"><Input defaultValue={BUSINESS.company} /></FormField>
            <FormField label="Contact name"><Input defaultValue={BUSINESS.name} /></FormField>
            <FormField label="Email"><Input defaultValue={BUSINESS.email} type="email" /></FormField>
            <FormField label="Website"><Input defaultValue={BUSINESS.website} /></FormField>
            <FormField label="Industry"><Input defaultValue={BUSINESS.industry} /></FormField>
            <FormField label="Team size"><Input defaultValue={BUSINESS.size} /></FormField>
          </div>

          <FormField label="Company description" className="mt-4" hint="Shown to students viewing your projects">
            <Textarea
              rows={5}
              defaultValue={`${BUSINESS.company} is a ${BUSINESS.industry} company founded in ${BUSINESS.founded}. We work with verified university talent to ship product, design, and engineering projects.`}
            />
          </FormField>
        </Panel>
      </div>
    </PageShell>
  );
}
