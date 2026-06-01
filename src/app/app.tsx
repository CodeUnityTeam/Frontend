import { Header } from "@/widgets/header";
import { ChatBotCard } from "@/widgets/header/ui/project-card";
import { Outlet } from "react-router";
import { Footer } from "@/widgets/footer";

export function App() {
  return (
    <div className="app-layout">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
