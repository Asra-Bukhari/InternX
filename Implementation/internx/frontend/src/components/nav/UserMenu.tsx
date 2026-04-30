import { useState, useRef, useEffect } from "react";
import { ChevronDown, LogOut, User as UserIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "@/lib/auth/useAuth";

interface UserMenuProps {
  profileHref: string;
}

export function UserMenu({ profileHref }: UserMenuProps) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) return null;
  const initials = user.name.split(" ").map((p) => p[0]).slice(0, 2).join("");
  const firstName = user.name.split(" ")[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 items-center gap-2 rounded-md border border-border-default bg-surface-2 pl-1 pr-2 hover:bg-surface-3"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand text-[12px] font-semibold text-brand-foreground">
          {initials}
        </span>
        <span className="text-[13px] text-text">{firstName}</span>
        <ChevronDown size={13} className="text-text-subtle" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-md border border-border-default bg-surface-2 shadow-lg overflow-hidden text-[13px]">
          <div className="px-3 py-2 border-b border-border-subtle">
            <p className="font-medium text-text">{user.name}</p>
            <p className="text-[11.5px] text-text-subtle">{user.email}</p>
          </div>
          <button
            onClick={() => { setOpen(false); navigate(profileHref); }}
            className="flex w-full items-center gap-2 px-3 py-2 text-text hover:bg-surface-3"
          >
            <UserIcon size={14} /> Profile
          </button>
          <button
            onClick={() => { logout(); navigate("/login"); }}
            className="flex w-full items-center gap-2 px-3 py-2 text-text hover:bg-surface-3"
          >
            <LogOut size={14} /> Log out
          </button>
        </div>
      )}
    </div>
  );
}
