import { useState } from "react";
import { Send, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface ChatBubble {
  id: string;
  fromMe: boolean;
  text: string;
  time: string;
  senderInitials?: string;
  senderName?: string;
}

interface ChatPaneProps {
  messages: ChatBubble[];
  onSend?: (text: string) => void;
  className?: string;
  emptyHint?: string;
  placeholder?: string;
}

export function ChatPane({ messages, onSend, className, emptyHint, placeholder = "Write a message…" }: ChatPaneProps) {
  const [draft, setDraft] = useState("");

  function handleSend() {
    const t = draft.trim();
    if (!t) return;
    onSend?.(t);
    setDraft("");
  }

  return (
    <div className={cn("flex h-full min-h-[420px] flex-col", className)}>
      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {messages.length === 0 && emptyHint && (
          <p className="text-center text-[12.5px] text-text-subtle py-8">{emptyHint}</p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={cn("flex gap-3", m.fromMe ? "justify-end" : "justify-start")}>
            {!m.fromMe && m.senderInitials && (
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-surface-3 text-[11px] font-semibold text-text-dim">
                {m.senderInitials}
              </div>
            )}
            <div className={cn("max-w-[75%]")}>
              <div
                className={cn(
                  "rounded-lg px-3.5 py-2 text-[13px] leading-relaxed",
                  m.fromMe
                    ? "bg-brand text-brand-foreground"
                    : "bg-surface-3 text-text",
                )}
              >
                {m.text}
              </div>
              <p className={cn("mt-1 text-[10.5px] text-text-subtle", m.fromMe && "text-right")}>
                {m.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {onSend && (
        <div className="flex items-end gap-2 border-t border-border-subtle p-3">
          <button className="rounded-md p-2 text-text-subtle hover:bg-surface-3 hover:text-text">
            <Paperclip size={16} />
          </button>
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
            placeholder={placeholder}
            className="flex-1 resize-none rounded-md border border-border-default bg-surface-1 px-3 py-2 text-[13px] text-text placeholder:text-text-subtle outline-none focus:border-brand"
          />
          <button
            onClick={handleSend}
            disabled={!draft.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-md bg-brand text-brand-foreground disabled:opacity-50 hover:bg-[#E55F15]"
          >
            <Send size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
