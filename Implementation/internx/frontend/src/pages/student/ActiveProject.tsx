import { useState } from "react";
import { CheckCircle2, ListChecks, MessageSquare, FilesIcon, Package } from "lucide-react";
import { PageShell } from "@/components/forms/PageShell";
import { Panel } from "@/components/forms/Panel";
import { ProgressBar } from "@/components/data-display/ProgressBar";
import { TaskList } from "@/components/domain/TaskList";
import { ChatPane, type ChatBubble } from "@/components/domain/ChatPane";
import { DeliverableCard } from "@/components/domain/DeliverableCard";
import { GhostButton } from "@/components/forms/GhostButton";
import { ACTIVE_PROJECT, TASKS, MESSAGES, DELIVERABLES } from "@/lib/mock/student";
import { cn } from "@/lib/utils/cn";
import type { TaskItem } from "@/components/domain/TaskList";

const TABS = [
  { key: "overview", label: "Overview", icon: CheckCircle2 },
  { key: "tasks", label: "Tasks", icon: ListChecks },
  { key: "chat", label: "Chat", icon: MessageSquare },
  { key: "deliverables", label: "Deliverables", icon: Package },
  { key: "files", label: "Files", icon: FilesIcon },
] as const;

type TabKey = typeof TABS[number]["key"];

export default function StudentActiveProject() {
  const [tab, setTab] = useState<TabKey>("overview");

  const initialMessages: ChatBubble[] = MESSAGES.map((m) => ({
    id: m.id,
    fromMe: m.from === "me",
    text: m.text,
    time: m.time,
    senderInitials: m.from === "them" ? "BH" : undefined,
  }));
  const [messages, setMessages] = useState<ChatBubble[]>(initialMessages);

  const tasks: TaskItem[] = TASKS.map((t) => ({
    id: t.id,
    title: t.title,
    status: t.status as TaskItem["status"],
    due: t.due,
    priority: t.priority,
  }));

  return (
    <PageShell title={ACTIVE_PROJECT.title} subtitle={ACTIVE_PROJECT.business}>
      <Panel padding="p-6" className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[12px] text-text-subtle uppercase tracking-wider">Progress</p>
            <p className="mt-1 text-[24px] font-bold text-text">{ACTIVE_PROJECT.progress}%</p>
          </div>
          <div className="hidden md:flex flex-col gap-1 text-[12px] text-text-subtle min-w-[180px]">
            <span><span className="text-text-muted">Started:</span> {ACTIVE_PROJECT.startDate}</span>
            <span><span className="text-text-muted">Deadline:</span> {ACTIVE_PROJECT.endDate}</span>
            <span><span className="text-brand font-medium">{ACTIVE_PROJECT.daysLeft} days left</span></span>
          </div>
          <div className="flex-1 min-w-[180px]"><ProgressBar value={ACTIVE_PROJECT.progress} /></div>
        </div>
      </Panel>

      <div className="flex items-center gap-1 border-b border-border-subtle mb-6 overflow-x-auto">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "relative inline-flex items-center gap-2 px-4 py-2.5 text-[13px] transition-colors",
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

      {tab === "overview" && (
        <div className="grid lg:grid-cols-3 gap-6">
          <Panel padding="p-6" className="lg:col-span-2">
            <h2 className="text-[16px] font-semibold text-text">About</h2>
            <p className="mt-2 text-[13.5px] text-text-muted leading-relaxed">{ACTIVE_PROJECT.description}</p>
            <h3 className="mt-6 text-[14px] font-semibold text-text">Milestones</h3>
            <ul className="mt-3 space-y-3">
              {ACTIVE_PROJECT.milestones.map((m) => (
                <li key={m.name} className="flex items-center gap-3">
                  <span className={cn(
                    "grid h-6 w-6 place-items-center rounded-full text-[10px] font-semibold",
                    m.done ? "bg-status-success-soft text-status-success" : "bg-surface-3 text-text-subtle",
                  )}>
                    {m.done ? <CheckCircle2 size={13} /> : "·"}
                  </span>
                  <span className={cn("text-[13.5px] flex-1", m.done ? "text-text-subtle line-through" : "text-text")}>{m.name}</span>
                  <span className="text-[11.5px] text-text-subtle">Due {m.due}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel padding="p-5">
            <h3 className="text-[14px] font-semibold text-text mb-4">Project info</h3>
            <ul className="space-y-3 text-[13px]">
              <li className="flex justify-between"><span className="text-text-subtle">Budget</span><span className="text-text font-medium">{ACTIVE_PROJECT.budget}</span></li>
              <li className="flex justify-between"><span className="text-text-subtle">Status</span><span className="text-brand font-medium">In Progress</span></li>
              <li className="flex justify-between"><span className="text-text-subtle">Days left</span><span className="text-text font-medium">{ACTIVE_PROJECT.daysLeft}</span></li>
            </ul>
          </Panel>
        </div>
      )}

      {tab === "tasks" && (
        <Panel padding="p-6">
          <TaskList tasks={tasks} />
        </Panel>
      )}

      {tab === "chat" && (
        <Panel padding="p-0" className="overflow-hidden">
          <ChatPane
            messages={messages}
            onSend={(text) => setMessages((m) => [...m, {
              id: `tmp-${Date.now()}`, fromMe: true, text, time: "now",
            }])}
          />
        </Panel>
      )}

      {tab === "deliverables" && (
        <div className="grid md:grid-cols-2 gap-4">
          {DELIVERABLES.map((d) => (
            <DeliverableCard key={d.id} deliverable={{
              id: d.id, version: d.version, date: d.submitted, status: d.status, note: d.notes,
            }} />
          ))}
          <div className="md:col-span-2">
            <GhostButton size="md">+ Submit new deliverable</GhostButton>
          </div>
        </div>
      )}

      {tab === "files" && (
        <Panel padding="p-6">
          <p className="text-[13px] text-text-muted">Files attached to this project will appear here.</p>
        </Panel>
      )}
    </PageShell>
  );
}
