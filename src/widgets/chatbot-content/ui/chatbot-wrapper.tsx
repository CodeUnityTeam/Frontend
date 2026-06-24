import { useState } from "react";

import { useProjects, useRecommendations } from "@/entities/project";
import type { Project } from "@/entities/project";
import type { TChatbotWrapper } from "@/entities/review/model/types";
import { useIsAuthed } from "@/shared/lib/auth";
import { Button } from "@/shared/ui/button";
import type { CarouselApi } from "@/shared/ui/carousel";
import { ProjectCard } from "@/widgets/project-card";
import { ChatbotTabs } from "./chatbot-tabs";
import { ChatbotNavigate } from "./chatbot-navigate";
import { ChatbotBtn } from "./chatbot-btn";
import { ChatbotRender } from "./chatbot-render";

export type TTabId = "popular" | "recommended" | "profile";

const CAROUSEL_PAGE_SIZE = 10;

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

function ProjectsSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={`projects-skeleton-${index}`}
          className="h-[300px] w-[273px] shrink-0 animate-pulse rounded-[var(--radius-lg)] bg-muted"
        />
      ))}
    </div>
  );
}

function ProjectsError({ onRetry }: { onRetry: () => void }) {
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

type ProjectsCarouselProps = {
  isPending: boolean;
  isError: boolean;
  refetch: () => void;
  projects: Project[];
  emptyText: string;
  onApi: (api: CarouselApi) => void;
};

function ProjectsCarousel({
  isPending,
  isError,
  refetch,
  projects,
  emptyText,
  onApi,
}: ProjectsCarouselProps) {
  if (isPending) {
    return <ProjectsSkeleton />;
  }
  if (isError) {
    return <ProjectsError onRetry={refetch} />;
  }
  if (projects.length === 0) {
    return <ChatbotMessage text={emptyText} />;
  }

  const items = projects.map((project) => ({
    id: project.projectId,
    card: (
      <div className="w-[273px]">
        <ProjectCard
          title={project.title}
          description={project.shortDesc}
          tags={project.skills.map((skill) => skill.name)}
          date={formatDate(project.publishedAt)}
          location={project.location}
        />
      </div>
    ),
  }));

  return <ChatbotRender items={items} api={onApi} />;
}

export function ChatbotWrapper({
  onTabChange,
  title,
  buttonText,
  onButtonClick,
}: TChatbotWrapper) {
  const [activeTab, setActiveTab] = useState<TTabId>("popular");
  const [api, setApi] = useState<CarouselApi>();
  const isAuthed = useIsAuthed();

  const popularQuery = useProjects({
    sortBy: "like",
    pageSize: CAROUSEL_PAGE_SIZE,
  });

  const recommendationsQuery = useRecommendations({
    limit: CAROUSEL_PAGE_SIZE,
    enabled: isAuthed,
  });

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as TTabId);
    onTabChange?.(tabId);
  };

  const renderTab = () => {
    if (activeTab === "popular") {
      return (
        <ProjectsCarousel
          isPending={popularQuery.isPending}
          isError={popularQuery.isError}
          refetch={() => popularQuery.refetch()}
          projects={
            popularQuery.data?.pages.flatMap((page) => page.items) ?? []
          }
          emptyText="Пока нет проектов"
          onApi={setApi}
        />
      );
    }

    if (activeTab === "recommended") {
      if (!isAuthed) {
        return (
          <ChatbotMessage text="Войдите, чтобы увидеть персональные рекомендации" />
        );
      }
      return (
        <ProjectsCarousel
          isPending={recommendationsQuery.isPending}
          isError={recommendationsQuery.isError}
          refetch={() => recommendationsQuery.refetch()}
          projects={recommendationsQuery.data?.items ?? []}
          emptyText="Пока нет рекомендаций"
          onApi={setApi}
        />
      );
    }

    return <ChatbotMessage text="Раздел скоро появится" />;
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

      {renderTab()}

      <ChatbotBtn
        buttonTitle={title}
        buttonText={buttonText}
        onButtonClick={onButtonClick}
      />
    </div>
  );
}
