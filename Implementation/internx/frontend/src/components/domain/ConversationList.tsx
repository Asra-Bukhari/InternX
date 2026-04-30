import { cn } from "@/lib/utils/cn";

export interface ConversationItem {
  id: string;
  name: string;
  initials: string;
  subtitle?: string;
  last: string;
  time: string;
  unread: number;
}

interface ConversationListProps {
  conversations: ConversationItem[];
  activeId?: string;
  onSelect?: (id: string) => void;
  className?: string;
}

export function ConversationList({ conversations, activeId, onSelect, className }: ConversationListProps) {
  return (
    <ul className={cn("divide-y divide-border-subtle", className)}>
      {conversations.map((c) => {
        const active = c.id === activeId;
        return (
          <li key={c.id}>
            <button
              onClick={() => onSelect?.(c.id)}
              className={cn(
                "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors",
                active ? "bg-surface-3" : "hover:bg-surface-2",
              )}
            >
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand/15 text-[12px] font-semibold text-brand">
                {c.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className={cn("text-[13px] truncate", active ? "text-text font-semibold" : "text-text font-medium")}>
                    {c.name}
                  </p>
                  <span className="text-[10.5px] text-text-subtle flex-shrink-0">{c.time}</span>
                </div>
                {c.subtitle && (
                  <p className="text-[11px] text-text-subtle truncate mt-0.5">{c.subtitle}</p>
                )}
                <div className="flex items-center justify-between gap-2 mt-1">
                  <p className="text-[12px] text-text-muted truncate">{c.last}</p>
                  {c.unread > 0 && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-brand-foreground">
                      {c.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
