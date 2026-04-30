import { Video, Calendar, Clock } from "lucide-react";
import { Panel } from "@/components/forms/Panel";
import { StatusTag, type StatusVariant } from "@/components/data-display/StatusTag";

export interface MeetingCardData {
  id: string;
  date: string;
  time: string;
  duration: string;
  price: string;
  status: string;
  topic: string;
}

interface MeetingCardProps {
  meeting: MeetingCardData;
}

function variantFor(status: string): StatusVariant {
  const s = status.toLowerCase();
  if (s.includes("complet")) return "completed";
  if (s.includes("schedul")) return "scheduled";
  return "info";
}

export function MeetingCard({ meeting }: MeetingCardProps) {
  return (
    <Panel padding="p-4" className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-md bg-brand-2/25 text-[#5BA8DD]">
          <Video size={16} />
        </div>
        <div>
          <p className="text-[13.5px] font-medium text-text">{meeting.topic}</p>
          <div className="mt-0.5 flex items-center gap-3 text-[11.5px] text-text-subtle">
            <span className="inline-flex items-center gap-1"><Calendar size={11} /> {meeting.date}</span>
            <span className="inline-flex items-center gap-1"><Clock size={11} /> {meeting.time} · {meeting.duration}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[13px] font-semibold text-text">{meeting.price}</span>
        <StatusTag label={meeting.status} variant={variantFor(meeting.status)} />
      </div>
    </Panel>
  );
}
