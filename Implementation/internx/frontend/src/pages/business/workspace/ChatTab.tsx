import { useEffect, useState } from "react";
import { Panel } from "@/components/forms/Panel";
import { ChatPane, type ChatBubble } from "@/components/domain/ChatPane";
import { EmptyState } from "@/components/feedback/EmptyState";
import { useAuth } from "@/lib/auth/useAuth";
import { messagesApi, formatMessageTime, type BackendMessage } from "@/lib/api/messages";
import { ApiError } from "@/lib/api/client";
import { MessageSquare, AlertCircle } from "lucide-react";

interface Props {
  projectId: string;
  receiverId: string | null;
}

export function ChatTab({ projectId, receiverId }: Props) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<BackendMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await messagesApi.forProject(projectId);
        if (cancelled) return;
        setMessages(res);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Could not load chat.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  if (!receiverId) {
    return (
      <Panel padding="p-12">
        <EmptyState
          icon={<MessageSquare size={20} />}
          title="Chat unlocks after selecting a student"
          description="Once you hire a student for this project, you can message them here."
        />
      </Panel>
    );
  }

  if (error) {
    return (
      <div className="flex items-start gap-2 rounded-md border border-status-danger/30 bg-status-danger-soft px-3 py-2.5 text-[12.5px] text-status-danger">
        <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  const bubbles: ChatBubble[] = messages.map((m) => {
    const senderId = typeof m.senderId === "string" ? m.senderId : m.senderId._id;
    return {
      id: m._id,
      fromMe: senderId === user?.id,
      text: m.message,
      time: formatMessageTime(m.createdAt),
    };
  });

  async function onSend(text: string) {
    if (!receiverId) return;
    try {
      await messagesApi.send({ projectId, receiverId, content: text });
      const res = await messagesApi.forProject(projectId);
      setMessages(res);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send message.");
    }
  }

  return (
    <Panel padding="p-0" className="overflow-hidden">
      {loading ? (
        <p className="p-6 text-[13px] text-text-subtle">Loading…</p>
      ) : (
        <ChatPane messages={bubbles} onSend={onSend} />
      )}
    </Panel>
  );
}
