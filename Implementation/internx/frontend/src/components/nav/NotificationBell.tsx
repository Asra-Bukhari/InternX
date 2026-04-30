import { Bell } from "lucide-react";

export function NotificationBell() {
  return (
    <button
      type="button"
      className="relative flex h-9 w-9 items-center justify-center rounded-md border border-border-default bg-surface-2 text-text hover:bg-surface-3"
      aria-label="Notifications"
    >
      <Bell size={15} />
      <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-brand" />
    </button>
  );
}
