import { Header } from "@/widgets/header";
import { Outlet } from "react-router";
import { Footer } from "@/widgets/footer";
import { Toaster } from "@/shared/ui/sonner";

export function App() {
  return (
    <div className="app-layout">
      <Header />
      <Outlet />
      <Footer />
      <Toaster closeButton />
    </div>
  );
}
