import { useState } from "react";

import { useProjects } from "@/entities/project";
import type { TChatbotWrapper } from "@/entities/review/model/types";
import { Button } from "@/shared/ui/button";
import type { CarouselApi } from "@/shared/ui/carousel";
import { ChatBotCard } from "@/widgets/project-card";
import { ChatbotTabs } from "./chatbot-tabs";
import { ChatbotNavigate } from "./chatbot-navigate";
import { ChatbotBtn } from "./chatbot-btn";
import { ChatbotRender } from "./chatbot-render";

export type TTabId = "popular" | "recommended" | "profile";

const POPULAR_PAGE_SIZE = 10;

const TABS: { id: TTabId; label: string }[] = [
  { id: "popular", label: "Популярное" },
  { id: "recommended", label: "Рекомендации" },
  { id: "profile", label: "Профили" },
];

const dateFormatter = new Intl.DateTimeFormat("ru", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function formatDate(iso: string | null): string {
  if (!iso) {
    return "";
  }
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "" : dateFormatter.format(date);
}

function PopularSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={`popular-skeleton-${index}`}
          className="h-[300px] w-[273px] shrink-0 animate-pulse rounded-[var(--radius-lg)] bg-muted"
        />
      ))}
    </div>
  );
}

function PopularError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <p className="text-muted-foreground">
        Не удалось загрузить проекты. Попробуйте ещё раз.
      </p>
      <Button type="button" onClick={onRetry}>
        Повторить
      </Button>
    </div>
  );
}

function ChatbotMessage({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center py-12 text-center">
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
}

export function ChatbotWrapper({
  onTabChange,
  title,
  buttonText,
  onButtonClick,
}: TChatbotWrapper) {
  const [activeTab, setActiveTab] = useState<TTabId>("popular");
  const [api, setApi] = useState<CarouselApi>();

  const { data, isPending, isError, refetch } = useProjects({
    sortBy: "like",
    pageSize: POPULAR_PAGE_SIZE,
  });

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as TTabId);
    onTabChange?.(tabId);
  };

  const renderPopular = () => {
    if (isPending) {
      return <PopularSkeleton />;
    }
    if (isError) {
      return <PopularError onRetry={() => refetch()} />;
    }

    const projects = data.pages.flatMap((page) => page.items);
    if (projects.length === 0) {
      return <ChatbotMessage text="Пока нет проектов" />;
    }

    const items = projects.map((project) => ({
      id: project.projectId,
      card: (
        <ChatBotCard
          title={project.title}
          description={project.shortDesc}
          tags={project.skills.map((skill) => skill.name)}
          date={formatDate(project.publishedAt)}
          location={project.location}
        />
      ),
    }));

    return <ChatbotRender items={items} api={setApi} />;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-6">
        <ChatbotTabs
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        <ChatbotNavigate
          onPrev={() => api?.scrollPrev()}
          onNext={() => api?.scrollNext()}
        />
      </div>

      {activeTab === "popular" ? (
        renderPopular()
      ) : (
        <ChatbotMessage text="Раздел скоро появится" />
      )}

      <ChatbotBtn
        buttonTitle={title}
        buttonText={buttonText}
        onButtonClick={onButtonClick}
      />
    </div>
  );
}
