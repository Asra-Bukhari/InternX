import { useEffect, useMemo, useState } from "react";
import { MessageSquare, AlertCircle } from "lucide-react";
import { PageShell } from "@/components/forms/PageShell";
import { Panel } from "@/components/forms/Panel";
import { ConversationList } from "@/components/domain/ConversationList";
import { ChatPane, type ChatBubble } from "@/components/domain/ChatPane";
import { EmptyState } from "@/components/feedback/EmptyState";
import { useAuth } from "@/lib/auth/useAuth";
import {
  messagesApi,
  threadsFromMessages,
  formatMessageTime,
  type MessageThread,
} from "@/lib/api/messages";
import { ApiError } from "@/lib/api/client";

export default function BusinessMessages() {
  const { user } = useAuth();
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setSending] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const msgs = await messagesApi.myMessages();
        if (cancelled) return;
        const t = threadsFromMessages(msgs, user!.id);
        setThreads(t);
        if (t.length > 0 && !activeId) setActiveId(t[0].projectId);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Could not load messages.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const active = useMemo(() => threads.find((t) => t.projectId === activeId) ?? null, [threads, activeId]);

  const conversations = threads.map((t) => ({
    id: t.projectId,
    name: t.counterpart.name,
    initials: t.counterpart.initials,
    subtitle: t.projectTitle,
    last: t.lastMessage,
    time: t.lastTime,
    unread: t.unread,
  }));

  const bubbles: ChatBubble[] = active
    ? active.messages.map((m) => {
        const senderId = typeof m.senderId === "string" ? m.senderId : m.senderId._id;
        return {
          id: m._id,
          fromMe: senderId === user?.id,
          text: m.message,
          time: formatMessageTime(m.createdAt),
          senderInitials: active.counterpart.initials,
        };
      })
    : [];

  async function onSend(text: string) {
    if (!active || !user) return;
    setSending(true);
    try {
      await messagesApi.send({
        projectId: active.projectId,
        receiverId: active.counterpart.id,
        content: text,
      });
      // Optimistic refetch
      const msgs = await messagesApi.myMessages();
      setThreads(threadsFromMessages(msgs, user.id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send message.");
    } finally {
      setSending(false);
    }
  }

  return (
    <PageShell title="Messages" subtitle="Conversations with selected and shortlisted students">
      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-md border border-status-danger/30 bg-status-danger-soft px-3 py-2.5 text-[12.5px] text-status-danger">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <p className="text-[13px] text-text-subtle">Loading…</p>
      ) : threads.length === 0 ? (
        <Panel padding="p-12">
          <EmptyState
            icon={<MessageSquare size={20} />}
            title="No conversations yet"
            description="Once you select a student for a project, you'll be able to message them here."
          />
        </Panel>
      ) : (
        <Panel padding="p-0" className="overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] min-h-[600px] divide-y md:divide-y-0 md:divide-x divide-border-subtle">
            <ConversationList conversations={conversations} activeId={activeId ?? undefined} onSelect={setActiveId} />
            {active ? (
              <div className="flex flex-col">
                <div className="border-b border-border-subtle px-5 py-3.5">
                  <p className="text-[14px] font-semibold text-text">{active.counterpart.name}</p>
                  <p className="text-[11.5px] text-text-subtle">{active.projectTitle}</p>
                </div>
                <ChatPane messages={bubbles} onSend={onSend} />
              </div>
            ) : (
              <div className="grid place-items-center text-text-subtle text-[13px]">Select a conversation</div>
            )}
          </div>
        </Panel>
      )}
    </PageShell>
  );
}
