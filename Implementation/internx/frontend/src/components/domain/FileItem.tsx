import { File, FileText, Image as ImageIcon, Download, Archive } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface FileItemData {
  id: string;
  name: string;
  type?: string;
  size: string;
  uploadedBy?: string;
  date: string;
}

interface FileItemProps {
  file: FileItemData;
  onDownload?: () => void;
  className?: string;
}

function iconFor(type?: string, name?: string) {
  const t = (type || name || "").toLowerCase();
  if (t.includes("zip") || t.includes(".zip")) return Archive;
  if (t.includes("image") || /\.(png|jpe?g|gif|webp|svg)$/.test(t)) return ImageIcon;
  if (t.includes("pdf")) return FileText;
  if (t.includes("fig")) return FileText;
  return File;
}

export function FileItem({ file, onDownload, className }: FileItemProps) {
  const Icon = iconFor(file.type, file.name);
  return (
    <div className={cn("flex items-center justify-between gap-3 rounded-lg border border-border-default bg-surface-2 px-4 py-3", className)}>
      <div className="flex items-center gap-3 min-w-0">
        <div className="grid h-10 w-10 place-items-center rounded-md bg-surface-3 text-text-dim flex-shrink-0">
          <Icon size={16} />
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-text truncate">{file.name}</p>
          <p className="text-[11px] text-text-subtle">
            {file.size}
            {file.uploadedBy && <> · {file.uploadedBy}</>}
            {file.date && <> · {file.date}</>}
          </p>
        </div>
      </div>
      <button
        onClick={onDownload}
        className="flex h-8 w-8 items-center justify-center rounded-md text-text-subtle hover:bg-surface-3 hover:text-text"
        aria-label="Download file"
      >
        <Download size={14} />
      </button>
    </div>
  );
}
