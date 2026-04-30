import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, LayoutDashboard, ListChecks, MessageSquare, Video, FolderOpen, Package } from "lucide-react";
import { PageShell } from "@/components/forms/PageShell";
import { GhostButton } from "@/components/forms/GhostButton";
import { OverviewTab } from "./workspace/OverviewTab";
import { TasksTab } from "./workspace/TasksTab";
import { ChatTab } from "./workspace/ChatTab";
import { MeetingsTab } from "./workspace/MeetingsTab";
import { FilesTab } from "./workspace/FilesTab";
import { DeliverablesTab } from "./workspace/DeliverablesTab";
import { WORKSPACE_PROJECT } from "@/lib/mock/business";
import { cn } from "@/lib/utils/cn";

const TABS = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "tasks", label: "Tasks", icon: ListChecks },
  { key: "chat", label: "Chat", icon: MessageSquare },
  { key: "meetings", label: "Meetings", icon: Video },
  { key: "files", label: "Files", icon: FolderOpen },
  { key: "deliverables", label: "Deliverables", icon: Package },
] as const;

type TabKey = typeof TABS[number]["key"];

export default function BusinessProjectWorkspace() {
  const { id: _id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>("overview");

  return (
    <PageShell
      title={WORKSPACE_PROJECT.title}
      subtitle={`With ${WORKSPACE_PROJECT.student.name}`}
      actions={<GhostButton icon={<ArrowLeft size={14} />} onClick={() => navigate(-1)}>Back</GhostButton>}
    >
      <div className="flex items-center gap-1 border-b border-border-subtle mb-6 overflow-x-auto">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "relative inline-flex items-center gap-2 px-4 py-2.5 text-[13px] transition-colors whitespace-nowrap",
                active ? "text-brand" : "text-text-subtle hover:text-text",
              )}
            >
              <Icon size={14} />
              {t.label}
              {active && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand" />}
            </button>
          );
        })}
      </div>

      {tab === "overview" && <OverviewTab />}
      {tab === "tasks" && <TasksTab />}
      {tab === "chat" && <ChatTab />}
      {tab === "meetings" && <MeetingsTab />}
      {tab === "files" && <FilesTab />}
      {tab === "deliverables" && <DeliverablesTab />}
    </PageShell>
  );
}
