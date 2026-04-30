import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-[600px] mx-auto px-6 py-32 text-center">
      <p className="text-[80px] font-bold text-brand leading-none tracking-tight">404</p>
      <h1 className="mt-2 text-[28px] font-bold text-text">Page not found</h1>
      <p className="mt-3 text-[14px] text-text-muted">
        The page you're looking for doesn't exist or was moved.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-md bg-brand px-5 py-2.5 text-[14px] font-medium text-brand-foreground hover:bg-[#E55F15]"
      >
        <ArrowLeft size={15} /> Back to home
      </Link>
    </div>
  );
}
