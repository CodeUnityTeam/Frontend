import type { TChatbotWrapper } from "@/entities/review/model/types";
import { ChatbotTabs } from "./chatbot-tabs";
import { ChatbotNavigate } from "./chatbot-navigate";
import { ChatbotBtn } from "./chatbot-btn";
import { useMemo, useState } from "react";
import { ChatBotCard } from "@/widgets/project-card";
import { ChatbotRender } from "./chatbot-render";
import type { CarouselApi } from "@/shared/ui/carousel";

export type TTabId = "popular" | "recommended" | "profile";

export function ChatbotWrapper({
  onTabChange,
  title,
  buttonText,
  onButtonClick
}: TChatbotWrapper) {

  const [activeTab, setActiveTab] = useState<TTabId>("popular");
  const [api, setApi] = useState<CarouselApi>();

  const tabs = [
      { id: "popular", label: "Популярное" },
      { id: "recommended", label: "Рекомендации" },
      { id: "profile", label: "Профили" },
    ];
  
    const items = useMemo(
      () => [
        {
          id: "1",
          card: (
            <ChatBotCard
              title="Чат-бот «CodeBuddy»"
              description="Разрабатываем Телеграм-бота, который отвечает на типовые вопросы по отладке, синтаксису и заданиям из курсов."
              tags={["Python", "Flask/FastAPI", "SQLite", "Telegram Bot API", "Figma"]}
              date="15.04"
              location="Нижний Новгород"
            />
          ),
        },
        {
          id: "2",
          card: (
            <ChatBotCard
              title="Чат-бот «CodeBuddy»"
              description="Разрабатываем Телеграм-бота, который отвечает на типовые вопросы по отладке, синтаксису и заданиям из курсов."
              tags={["Python", "Flask/FastAPI", "SQLite", "Telegram Bot API", "Figma"]}
              date="15.04"
              location="Нижний Новгород"
            />
          ),
        },
        {
          id: "3",
          card: (
            <ChatBotCard
              title="Чат-бот «CodeBuddy»"
              description="Разрабатываем Телеграм-бота, который отвечает на типовые вопросы по отладке, синтаксису и заданиям из курсов."
              tags={["Python", "Flask/FastAPI", "SQLite", "Telegram Bot API", "Figma"]}
              date="15.04"
              location="Нижний Новгород"
            />
          ),
        },
        {
          id: "4",
          card: (
            <ChatBotCard
              title="Чат-бот «CodeBuddy»"
              description="Разрабатываем Телеграм-бота, который отвечает на типовые вопросы по отладке, синтаксису и заданиям из курсов."
              tags={["Python", "Flask/FastAPI", "SQLite", "Telegram Bot API", "Figma"]}
              date="15.04"
              location="Нижний Новгород"
            />
          ),
        },
        {
          id: "5",
          card: (
            <ChatBotCard
              title="Чат-бот «CodeBuddy»"
              description="Разрабатываем Телеграм-бота, который отвечает на типовые вопросы по отладке, синтаксису и заданиям из курсов."
              tags={["Python", "Flask/FastAPI", "SQLite", "Telegram Bot API", "Figma"]}
              date="15.04"
              location="Нижний Новгород"
            />
          ),
        },
      ],
      []
    );

  const handleTabChange = (tabId: string) => {
  setActiveTab(tabId as TTabId);
  onTabChange?.(tabId);
};

  return (
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-6">
          <ChatbotTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />

          <ChatbotNavigate onPrev={() => api?.scrollPrev()} 
          onNext={() => api?.scrollNext()} />
        </div>

        <ChatbotRender items={items}  api={setApi} />

        <ChatbotBtn
          buttonTitle={title}
          buttonText={buttonText}
          onButtonClick={onButtonClick}
        />
      </div>
  );
}