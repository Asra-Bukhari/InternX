import { useState } from "react";
import { Panel } from "@/components/forms/Panel";
import { ChatPane, type ChatBubble } from "@/components/domain/ChatPane";
import { WORKSPACE_CHAT } from "@/lib/mock/business";

export function ChatTab() {
  const initial: ChatBubble[] = WORKSPACE_CHAT.map((m) => ({
    id: m.id,
    fromMe: m.isMe,
    text: m.text,
    time: m.time,
    senderInitials: m.initials,
  }));
  const [messages, setMessages] = useState<ChatBubble[]>(initial);

  return (
    <Panel padding="p-0" className="overflow-hidden">
      <ChatPane
        messages={messages}
        onSend={(text) =>
          setMessages((m) => [...m, { id: `tmp-${Date.now()}`, fromMe: true, text, time: "now", senderInitials: "TC" }])
        }
      />
    </Panel>
  );
}
