import { useState } from "react";
import { PageShell } from "@/components/forms/PageShell";
import { Panel } from "@/components/forms/Panel";
import { ConversationList } from "@/components/domain/ConversationList";
import { ChatPane, type ChatBubble } from "@/components/domain/ChatPane";
import { CONVERSATIONS, MESSAGES } from "@/lib/mock/student";

export default function StudentMessages() {
  const [activeId, setActiveId] = useState(CONVERSATIONS[0]?.id);
  const active = CONVERSATIONS.find((c) => c.id === activeId);

  const initialMessages: ChatBubble[] = MESSAGES.map((m) => ({
    id: m.id,
    fromMe: m.from === "me",
    text: m.text,
    time: m.time,
    senderInitials: active?.initials,
  }));
  const [messages, setMessages] = useState<ChatBubble[]>(initialMessages);

  const conversations = CONVERSATIONS.map((c) => ({
    id: c.id, name: c.name, initials: c.initials, last: c.last, time: c.time, unread: c.unread,
  }));

  return (
    <PageShell title="Messages" subtitle="Conversations with businesses you've engaged">
      <Panel padding="p-0" className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] min-h-[600px] divide-y md:divide-y-0 md:divide-x divide-border-subtle">
          <ConversationList
            conversations={conversations}
            activeId={activeId}
            onSelect={setActiveId}
          />
          {active ? (
            <div className="flex flex-col">
              <div className="border-b border-border-subtle px-5 py-3.5">
                <p className="text-[14px] font-semibold text-text">{active.name}</p>
                <p className="text-[11.5px] text-text-subtle">Active project conversation</p>
              </div>
              <ChatPane
                messages={messages}
                onSend={(text) => setMessages((m) => [...m, {
                  id: `tmp-${Date.now()}`, fromMe: true, text, time: "now",
                }])}
              />
            </div>
          ) : (
            <div className="grid place-items-center text-text-subtle text-[13px]">Select a conversation</div>
          )}
        </div>
      </Panel>
    </PageShell>
  );
}
