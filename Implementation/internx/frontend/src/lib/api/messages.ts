import { api } from "./client";

export interface BackendUserRef {
  _id: string;
  name?: string;
  email?: string;
}

export interface BackendProjectRef {
  _id: string;
  title?: string;
  status?: string;
}

export interface BackendMessage {
  _id: string;
  senderId: string | BackendUserRef;
  receiverId: string | BackendUserRef;
  projectId: string | BackendProjectRef;
  message: string;
  createdAt: string;
}

export const messagesApi = {
  /** All messages where current user is sender or receiver. */
  myMessages: () => api.get<BackendMessage[]>("/api/messages/me"),

  /** Messages within a specific project (must be participant). */
  forProject: (projectId: string) =>
    api.get<BackendMessage[]>(`/api/messages/${projectId}`),

  /** Send a message. Backend expects `content`. */
  send: (params: { projectId: string; receiverId: string; content: string }) =>
    api.post<{ message: string; data: BackendMessage }>("/api/messages", params),
};

/** Group flat messages into one thread per project. */
export interface MessageThread {
  projectId: string;
  projectTitle: string;
  counterpart: { id: string; name: string; email: string; initials: string };
  lastMessage: string;
  lastTime: string;
  unread: number;
  messages: BackendMessage[];
}

export function threadsFromMessages(messages: BackendMessage[], currentUserId: string): MessageThread[] {
  const groups = new Map<string, BackendMessage[]>();
  for (const m of messages) {
    const pid = typeof m.projectId === "string" ? m.projectId : m.projectId._id;
    const arr = groups.get(pid) ?? [];
    arr.push(m);
    groups.set(pid, arr);
  }

  const threads: MessageThread[] = [];
  for (const [pid, arr] of groups) {
    arr.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    const last = arr[arr.length - 1];
    const projTitle =
      typeof last.projectId === "string" ? "Project" : last.projectId.title ?? "Project";

    // counterpart = the user that isn't us
    const lastSenderId = typeof last.senderId === "string" ? last.senderId : last.senderId._id;
    const otherRef =
      lastSenderId === currentUserId ? last.receiverId : last.senderId;
    const otherId = typeof otherRef === "string" ? otherRef : otherRef._id;
    const otherName = typeof otherRef === "string" ? "User" : otherRef.name ?? "User";
    const otherEmail = typeof otherRef === "string" ? "" : otherRef.email ?? "";

    threads.push({
      projectId: pid,
      projectTitle: projTitle,
      counterpart: {
        id: otherId,
        name: otherName,
        email: otherEmail,
        initials: otherName.split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "U",
      },
      lastMessage: last.message,
      lastTime: relativeShort(last.createdAt),
      unread: 0, // backend has no read receipts yet
      messages: arr,
    });
  }
  threads.sort((a, b) => new Date(b.messages[b.messages.length - 1].createdAt).getTime() - new Date(a.messages[a.messages.length - 1].createdAt).getTime());
  return threads;
}

function relativeShort(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(ms)) return "";
  const min = Math.floor(ms / 60000);
  if (min < 1) return "now";
  if (min < 60) return `${min}m`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h`;
  const d = Math.floor(hr / 24);
  if (d < 7) return `${d}d`;
  return `${Math.floor(d / 7)}w`;
}

export function formatMessageTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}
