import { Icon } from "@iconify/react";

import { useProjects, type GetProjectsParams } from "@/entities/project";
import { Button } from "@/shared/ui/button";
import { PageContainer } from "@/shared/ui/page-container";
import {
  FiltersProvider,
  FiltersBar,
  FiltersSidebar,
  FiltersMobile,
  SortMobile,
  useFilters,
  DURATION_MAX,
} from "@/widgets/filters";
import { ProjectCard } from "@/widgets/project-card";
import { ProjectsCatalog } from "@/widgets/projects-catalog";
import { Search } from "@/widgets/search";
import { FilterTabs } from "@/widgets/filter-tabs";
import { projectTabs } from "@/widgets/filter-tabs/model/tabs-data";
import { useState } from "react";


const PAGE_SIZE = 20;

const SORT_MAP: Record<string, GetProjectsParams["sortBy"]> = {
  popularity: "like",
  date: "published_at",
  relevance: "relevance",
};

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

function ProjectsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[repeat(auto-fill,minmax(273px,1fr))] md:gap-x-3.5">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={`project-skeleton-${index}`}
          className="h-[370px] w-full animate-pulse rounded-lg bg-muted"
        />
      ))}
    </div>
  );
}

function ProjectsError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="text-muted-foreground">
        Не удалось загрузить проекты. Попробуйте ещё раз.
      </p>
      <Button type="button" onClick={onRetry}>
        Повторить
      </Button>
    </div>
  );
}

function ProjectsEmpty() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-muted px-6 py-16 text-center">
      <Icon icon="ph:folder-dashed" className="size-12 text-muted-foreground" />
      <h3 className="text-xl font-semibold text-foreground">
        Пока нет проектов
      </h3>
      <p className="max-w-md text-sm text-muted-foreground">
        Здесь появятся проекты, как только их опубликуют. Загляните чуть позже.
      </p>
    </div>
  );
}

function ProjectsList({search}:{search:string}) {
  const { sort, selected, duration } = useFilters();

  const durationParam: GetProjectsParams["duration"] =
    duration < DURATION_MAX ? { operator: "less", max: duration } : undefined;
  const {
    data,
    isPending,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useProjects({
    pageSize: PAGE_SIZE,
    sortBy: SORT_MAP[sort],
    skillsId: selected.tags,
    formatId: selected.format,
    specId: selected.position,
    duration: durationParam,
    search
  });

  if (isPending) {
    return <ProjectsGridSkeleton />;
  }

  if (isError) {
    return <ProjectsError onRetry={() => refetch()} />;
  }

  const projects = data.pages.flatMap((page) => page.items);

  if (projects.length === 0) {
    return <ProjectsEmpty />;
  }

  const total = data.pages[0]?.total ?? projects.length;
  const remaining = Math.max(total - projects.length, 0);

  return (
    <>
      <ul className="grid grid-cols-1 gap-4 md:auto-rows-fr md:grid-cols-[repeat(auto-fill,minmax(273px,1fr))] md:gap-x-3.5">
        {projects.map((project) => (
          <li key={project.projectId}>
            <ProjectCard
              projectId={project.projectId}
              title={project.title}
              description={project.shortDesc}
              tags={project.skills.map((skill) => skill.name)}
              date={formatDate(project.publishedAt)}
              location={project.location}
              isLikedByMe={project.isLikedByMe}
            />
          </li>
        ))}
      </ul>

      {hasNextPage && (
        <div className="mt-8 flex justify-center">
          <Button
            variant="ghost"
            type="button"
            className="gap-2"
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? "Загрузка…" : `Загрузить ещё ${remaining}`}
            {!isFetchingNextPage && (
              <Icon icon="ph:caret-down" className="size-5" />
            )}
          </Button>
        </div>
      )}
    </>
  );
}

function ProjectsPage() {
  const [tab, setTab] = useState("catalog");
  const [search, setSearch] = useState("");
  return (
    <FiltersProvider>
      <PageContainer className="py-8">
        <Search onSearch={setSearch} />

        <div className="mb-6 flex items-center justify-between gap-4 md:hidden">
          <FiltersMobile />
          <SortMobile />
        </div>
        <FiltersBar className="mb-6 hidden md:flex" />
          
        <div className="md:flex md:items-start md:gap-5">
          <FiltersSidebar className="hidden md:block" />
          <div className="flex-1">
            <FilterTabs items={projectTabs} value={tab} onValueChange={setTab} />
            <ProjectsCatalog catalog={<ProjectsList search={search}/>} />
          </div>
        </div>
      </PageContainer>
    </FiltersProvider>
  );
}

export const Component = ProjectsPage;
