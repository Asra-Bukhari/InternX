import { Panel } from "@/components/forms/Panel";
import { MeetingCard } from "@/components/domain/MeetingCard";
import { PrimaryButton } from "@/components/forms/PrimaryButton";
import { Calendar } from "lucide-react";
import { WORKSPACE_MEETINGS } from "@/lib/mock/business";

export function MeetingsTab() {
  return (
    <div className="space-y-4">
      <Panel padding="p-5" className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-[14px] font-semibold text-text">Schedule a paid meeting</h3>
          <p className="text-[12px] text-text-subtle mt-0.5">Per-minute pricing set by the student.</p>
        </div>
        <PrimaryButton size="sm" icon={<Calendar size={13} />}>Schedule</PrimaryButton>
      </Panel>
      {WORKSPACE_MEETINGS.map((m) => <MeetingCard key={m.id} meeting={m} />)}
    </div>
  );
}
