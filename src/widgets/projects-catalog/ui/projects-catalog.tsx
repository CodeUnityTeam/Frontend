import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

import { employmentRole } from "@/shared/config/mock-config";
import { Button } from "@/shared/ui/button";
import { ChatBotCard } from "@/widgets/project-card";
import {
  type CatalogItem,
  fetchCatalogItems,
  PAGE_SIZE,
} from "../model/mocks";

type Tab = "catalog" | "favorites" | "responses" | "my";

const isWorker = employmentRole === "worker";

const CATALOG_LABEL = isWorker ? "Каталог проектов" : "Каталог пользователей";
const EMPTY_ENTITY = isWorker ? "проекты" : "профили";

const TABS: { id: Tab; label: string }[] = [
  { id: "catalog", label: CATALOG_LABEL },
  { id: "favorites", label: "Избранное" },
  { id: "responses", label: "Отклики" },
  { id: "my", label: "Мои проекты" },
];

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-muted">
        <Icon
          icon="ph:warning-circle"
          className="h-14 w-14 text-muted-foreground"
        />
      </div>
      <p className="text-[18px] font-semibold leading-[150%]">
        Не удалось загрузить {EMPTY_ENTITY}
      </p>
      <p className="max-w-[280px] text-[14px] leading-[150%] text-muted-foreground">
        Пожалуйста, перезагрузите страницу
        <br />
        или попробуйте зайти чуть позже
      </p>
    </div>
  );
}

export function ProjectsCatalog() {
  const [activeTab, setActiveTab] = useState<Tab>("catalog");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [items, setItems] = useState<CatalogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);

    fetchCatalogItems(employmentRole)
      .then(setItems)
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
  }, []);

  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;
  const isEmpty = isError || (!isLoading && items.length === 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-4 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.id}
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

      {activeTab === "catalog" && (
        <>
          {isLoading ? (
            <p className="py-20 text-center text-muted-foreground">
              Загрузка...
            </p>
          ) : isEmpty ? (
            <EmptyState />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {visibleItems.map((item) => (
                  <ChatBotCard
                    key={item.id}
                    title={item.title}
                    description={item.description}
                    tags={item.tags}
                    date={item.date}
                    location={item.location}
                  />
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center">
                  <Button
                    variant="ghost"
                    className="text-[16px] font-semibold"
                    onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                  >
                    Загрузить ещё {items.length - visibleCount} ↓
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
