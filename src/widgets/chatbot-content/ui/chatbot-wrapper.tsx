import { useState } from "react";

import { useProjects, useRecommendations } from "@/entities/project";
import type { Project } from "@/entities/project";
import type { TChatbotWrapper } from "@/entities/review/model/types";
import { useIsAuthed } from "@/shared/lib/auth";
import type { CarouselApi } from "@/shared/ui/carousel";
import { ProjectCard } from "@/widgets/project-card";
import { ChatbotTabs } from "./chatbot-tabs";
import { ChatbotNavigate } from "./chatbot-navigate";
import { ChatbotBtn } from "./chatbot-btn";
import { ChatbotRender } from "./chatbot-render";
import { ChatbotMessage } from "./chatbot-message";
import { formatDate } from "@/shared/lib/format-date";
import { ProjectsSkeleton } from "./projects-skeleton";
import { ProjectsError } from "./projects-error";

export type TTabId = "popular" | "recommended" | "profile";

const CAROUSEL_PAGE_SIZE = 10;

const TABS: { id: TTabId; label: string }[] = [
  { id: "popular", label: "Популярное" },
  { id: "recommended", label: "Рекомендации" },
  { id: "profile", label: "Профили" },
];

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
      <div className="h-full w-[273px]">
        <ProjectCard
          projectId={project.projectId}
          title={project.title}
          description={project.shortDesc}
          tags={project.skills.map((skill) => skill.name)}
          date={formatDate(project.publishedAt)}
          location={project.location}
          isFavoriteByMe={project.isFavoriteByMe}
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
