import { Link } from "react-router";

interface PlaceholderProps {
  title: string;
  description?: string;
  phase?: string;
}

/**
 * Phase-1 placeholder. Used for every route in the merged skeleton until
 * Phases 3–5 ship the real pages. Renders inside whatever layout owns
 * the route, so it doubles as proof that the route + layout pair mounted.
 */
export default function Placeholder({
  title,
  description,
  phase = "Phase 1 skeleton",
}: PlaceholderProps) {
  return (
    <div className="mx-auto max-w-[1440px] px-6 py-12">
      <div className="rounded-xl border border-border-default bg-surface-2 p-8">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-brand/10 px-2 py-0.5 text-[11.5px] font-medium text-brand">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          {phase}
        </span>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-2 text-sm text-text-muted">{description}</p>
        )}
        <div className="mt-6 flex gap-3 text-sm">
          <Link
            to="/"
            className="rounded-md border border-border-strong px-3 py-1.5 hover:bg-surface-3"
          >
            ← Home
          </Link>
        </div>
      </div>
    </div>
  );
}
