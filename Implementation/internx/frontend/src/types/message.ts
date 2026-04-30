export interface MessageThread {
  id: string;
  counterpart: string;
  counterpartInitials: string;
  projectTitle: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  fromMe: boolean;
  body: string;
  sentAt: string;
}
