import { useState, type ReactNode } from "react";

import { employmentRole } from "@/shared/config/mock-config";
import { ProjectsEmpty } from "./projects-empty";
import { Icon } from "@iconify/react";
import { useIsAuthed } from "@/shared/lib/auth";

type Tab = "catalog" | "favorites" | "responses" | "my";

const isWorker = employmentRole === "worker";

const CATALOG_LABEL = isWorker ? "Каталог" : "Каталог пользователей";

const TABS: { id: Tab; label: string }[] = [
  { id: "catalog", label: CATALOG_LABEL },
  { id: "favorites", label: "Избранное" },
  { id: "responses", label: "Отклики" },
  { id: "my", label: "Мои проекты" },
];

type ProjectsCatalogProps = {
  catalog: ReactNode;
};

export function ProjectsCatalog({ catalog }: ProjectsCatalogProps) {
  const [activeTab, setActiveTab] = useState<Tab>("catalog");
  const isAuthorized = useIsAuthed();

  let content: ReactNode;

  switch (activeTab) {
    case "catalog":
      content = catalog;
      break;

    case "favorites":
      content = <ProjectsEmpty title="Нет данных" />;
      break;

    case "responses":
      content = <ProjectsEmpty title="Нет данных" />;
      break;

    case "my":
      content = (
        <ProjectsEmpty
          title="Вы пока не создавали проекты"
          description="Возможно, сейчас самое время начать"
        />
      );
      break;
  }

  const visibleTabs = isAuthorized
  ? TABS
  : TABS.filter((tab) => tab.id === "catalog");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-4">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer pb-2 text-[18px] leading-[150%] transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {isAuthorized && activeTab === "my" && (
          <button
            type="button"
            className="flex items-center gap-1 text-[18px] leading-[100%] font-semibold"
          >
            Создать проект
            <Icon icon="ph:plus-circle" className="text-xl leading-none" />
          </button>
        )}
      </div>

      {content}
    </div>
  );
}
