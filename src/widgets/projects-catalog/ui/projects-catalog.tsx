import { useState, type ReactNode } from "react";

import { employmentRole } from "@/shared/config/mock-config";

type Tab = "catalog" | "favorites" | "responses" | "my";

const isWorker = employmentRole === "worker";

const CATALOG_LABEL = isWorker ? "Каталог проектов" : "Каталог пользователей";

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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-4 border-b border-border">
        {TABS.map((tab) => (
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

      {activeTab === "catalog" && catalog}
    </div>
  );
}
