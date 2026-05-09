import { useEffect, useState } from "react";
import { Package, AlertCircle } from "lucide-react";
import { Panel } from "@/components/forms/Panel";
import { DeliverableCard } from "@/components/domain/DeliverableCard";
import { EmptyState } from "@/components/feedback/EmptyState";
import { deliverablesApi, type BackendDeliverable } from "@/lib/api/payments";
import { ApiError } from "@/lib/api/client";

interface Props {
  projectId: string;
}

function formatDate(iso?: string): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return "";
  }
}

export function DeliverablesTab({ projectId }: Props) {
  const [items, setItems] = useState<BackendDeliverable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await deliverablesApi.forProject(projectId);
        if (cancelled) return;
        setItems(res);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Could not load deliverables.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  async function onApprove(id: string) {
    try {
      await deliverablesApi.approve(id);
      const res = await deliverablesApi.forProject(projectId);
      setItems(res);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not approve deliverable.");
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-[16px] font-semibold text-text">Deliverables</h2>
        <p className="text-[12px] text-text-subtle">Approve to release payment.</p>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-md border border-status-danger/30 bg-status-danger-soft px-3 py-2.5 text-[12.5px] text-status-danger">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <p className="text-[13px] text-text-subtle">Loading…</p>
      ) : items.length === 0 ? (
        <Panel padding="p-12">
          <EmptyState
            icon={<Package size={20} />}
            title="No deliverables yet"
            description="When the hired student submits work, it appears here for your review."
          />
        </Panel>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((d, idx) => (
            <DeliverableCard
              key={d._id}
              deliverable={{
                id: d._id,
                version: `v${idx + 1}`,
                date: formatDate(d.submittedAt),
                status:
                  d.status === "approved"
                    ? "Approved"
                    : d.status === "rejected"
                    ? "Revision Requested"
                    : "Pending Review",
                note: d.fileUrl,
              }}
              onApprove={d.status === "pending" ? () => onApprove(d._id) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
