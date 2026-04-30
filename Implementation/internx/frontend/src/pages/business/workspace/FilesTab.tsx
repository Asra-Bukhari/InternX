import { FileItem } from "@/components/domain/FileItem";
import { GhostButton } from "@/components/forms/GhostButton";
import { Upload } from "lucide-react";
import { WORKSPACE_FILES } from "@/lib/mock/business";

export function FilesTab() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[16px] font-semibold text-text">Files</h2>
          <p className="text-[12px] text-text-subtle">{WORKSPACE_FILES.length} files shared</p>
        </div>
        <GhostButton size="sm" icon={<Upload size={13} />}>Upload</GhostButton>
      </div>
      <div className="space-y-2">
        {WORKSPACE_FILES.map((f) => <FileItem key={f.id} file={f} />)}
      </div>
    </div>
  );
}
