import { Outlet } from "react-router";
import { PublicNavbar } from "@/components/nav/PublicNavbar";
import { Footer } from "@/components/nav/Footer";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-foreground">
      <PublicNavbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
