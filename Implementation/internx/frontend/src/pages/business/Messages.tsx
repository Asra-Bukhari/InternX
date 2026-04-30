import { useState } from "react";
import { PageShell } from "@/components/forms/PageShell";
import { Panel } from "@/components/forms/Panel";
import { ConversationList } from "@/components/domain/ConversationList";
import { ChatPane, type ChatBubble } from "@/components/domain/ChatPane";
import { BUSINESS_CONVERSATIONS, WORKSPACE_CHAT } from "@/lib/mock/business";

export default function BusinessMessages() {
  const [activeId, setActiveId] = useState(BUSINESS_CONVERSATIONS[0]?.id);
  const active = BUSINESS_CONVERSATIONS.find((c) => c.id === activeId);

  const conversations = BUSINESS_CONVERSATIONS.map((c) => ({
    id: c.id,
    name: c.name,
    initials: c.initials,
    subtitle: c.project,
    last: c.last,
    time: c.time,
    unread: c.unread,
  }));

  const initialMessages: ChatBubble[] = WORKSPACE_CHAT.map((m) => ({
    id: m.id,
    fromMe: m.isMe,
    text: m.text,
    time: m.time,
    senderInitials: m.initials,
  }));
  const [messages, setMessages] = useState<ChatBubble[]>(initialMessages);

  return (
    <PageShell title="Messages" subtitle="Conversations with selected and shortlisted students">
      <Panel padding="p-0" className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] min-h-[600px] divide-y md:divide-y-0 md:divide-x divide-border-subtle">
          <ConversationList conversations={conversations} activeId={activeId} onSelect={setActiveId} />
          {active ? (
            <div className="flex flex-col">
              <div className="border-b border-border-subtle px-5 py-3.5">
                <p className="text-[14px] font-semibold text-text">{active.name}</p>
                <p className="text-[11.5px] text-text-subtle">{active.project}</p>
              </div>
              <ChatPane
                messages={messages}
                onSend={(text) => setMessages((m) => [...m, {
                  id: `tmp-${Date.now()}`, fromMe: true, text, time: "now", senderInitials: "TC",
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
