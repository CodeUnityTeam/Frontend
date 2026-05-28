import { Header } from "@/widgets/header";
import { ChatBotCard } from "@/widgets/header/ui/project-card";
import { Outlet } from "react-router";

export function App() {
  return (
    <div className="app-layout">
      {/* тут размещается sidebar */}
      <Header />
      <Outlet />
      <ChatBotCard
        title="Чат-бот «CodeBuddy»"
        description="Разрабатываем Телеграм-бота, который отвечает на типовые вопросы по отладке, синтаксису и заданиям из курсов."
        tags={[
          "Python",
          "Flask/FastAPI",
          "SQLite",
          "Telegram Bot API",
          "Figma",
        ]}
        date="15.04"
        location="Нижний Новгород"
      />
    </div>
  );
}
