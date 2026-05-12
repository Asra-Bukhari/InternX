import { useEffect, useState, useRef, useCallback } from "react";
import { MessageSquare, Send, AlertCircle } from "lucide-react";
import { Panel } from "@/components/forms/Panel";
import { EmptyState } from "@/components/feedback/EmptyState";
import { useAuth } from "@/lib/auth/useAuth";
import { messagesApi, formatMessageTime, type BackendMessage } from "@/lib/api/messages";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils/cn";

interface Props {
  projectId: string;
  receiverId: string | null;
}

export function ChatTab({ projectId, receiverId }: Props) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<BackendMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentUserId = user?.id ?? "";

  const loadMessages = useCallback(async () => {
    try {
      const res = await messagesApi.forProject(projectId);
      setMessages(res);
      setError(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Could not load messages.");
      }
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Poll for new messages every 10s
  useEffect(() => {
    const interval = setInterval(loadMessages, 10000);
    return () => clearInterval(interval);
  }, [loadMessages]);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || sending || !receiverId) return;

    setSending(true);
    try {
      await messagesApi.send({
        projectId,
        receiverId,
        content: text,
      });
      setDraft("");
      await loadMessages();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const getInitials = (name: string) =>
    name.split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "U";

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

  if (loading) {
    return (
      <Panel padding="p-0" className="min-h-[500px] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <p className="text-[13px] text-text-subtle">Loading chat…</p>
        </div>
      </Panel>
    );
  }

  return (
    <Panel padding="p-0" className="flex flex-col min-h-[500px] max-h-[600px]">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
        {error && (
          <div className="flex items-start gap-2 rounded-md border border-status-danger/30 bg-status-danger-soft px-3 py-2.5 text-[12.5px] text-status-danger">
            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {messages.length === 0 && !error && (
          <div className="text-center py-16">
            <MessageSquare size={24} className="mx-auto text-text-subtle mb-3 opacity-40" />
            <p className="text-[13px] text-text-subtle">No messages yet. Start the conversation!</p>
          </div>
        )}

        {messages.map((m) => {
          const senderId = typeof m.senderId === "string" ? m.senderId : m.senderId._id;
          const fromMe = senderId === currentUserId;
          const senderName = typeof m.senderId === "string" ? "User" : m.senderId.name ?? "User";

          return (
            <div key={m._id} className={cn("flex gap-3", fromMe ? "justify-end" : "justify-start")}>
              {!fromMe && (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-surface-3 text-[11px] font-semibold text-text-dim">
                  {getInitials(senderName)}
                </div>
              )}
              <div className="max-w-[75%]">
                {!fromMe && (
                  <p className="text-[11px] text-text-subtle mb-1">{senderName}</p>
                )}
                <div
                  className={cn(
                    "rounded-lg px-3.5 py-2 text-[13px] leading-relaxed",
                    fromMe
                      ? "bg-brand text-brand-foreground"
                      : "bg-surface-3 text-text",
                  )}
                >
                  {m.message}
                </div>
                <p className={cn("mt-1 text-[10.5px] text-text-subtle", fromMe && "text-right")}>
                  {formatMessageTime(m.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="flex items-end gap-2 border-t border-border-default p-3">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          rows={1}
          placeholder="Write a message…"
          disabled={sending}
          className="flex-1 resize-none rounded-md border border-border-default bg-surface-1 px-3 py-2 text-[13px] text-text placeholder:text-text-subtle outline-none focus:border-brand disabled:opacity-60"
        />
        <button
          onClick={handleSend}
          disabled={!draft.trim() || sending}
          className="flex h-9 w-9 items-center justify-center rounded-md bg-brand text-brand-foreground disabled:opacity-50 hover:bg-[#E55F15] transition-colors"
        >
          <Send size={15} />
        </button>
      </div>
    </Panel>
  );
}
