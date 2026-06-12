import { Header } from "@/widgets/header";
import { Outlet } from "react-router";
import { Footer } from "@/widgets/footer";
import { ChatbotCardsPage } from "@/pages/chatbot-cards/chatbot-cards";

export function App() {
  return (
    <div className="app-layout">
      <Header />
      <Outlet />
      <ChatbotCardsPage />
      <Footer />
    </div>
  );
}
