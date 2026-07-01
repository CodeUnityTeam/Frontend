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
import { ProjectsEmpty } from "@/widgets/projects-catalog/ui/projects-empty";
import { Search } from "@/widgets/search";

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

function ProjectsError() {
  return (
    <div className="flex flex-col items-center gap-2 py-5 text-center">
      <span
        className="flex h-20 w-20 items-center justify-center rounded-[var(--radius-lg)]"
        style={{ backgroundColor: "var(--color-light-gray-200)" }}
      >
        <Icon
          icon="ph:warning-circle"
          className="h-16 w-16 text-xl text-muted-foreground"
        />
      </span>
      <h3 className="flex text-[20px] leading-[130%] font-semibold text-foreground">
        Не удалось загрузить проекты и профили.
      </h3>
      <p className="max-w-md text-[18px] leading-[150%] text-muted-foreground">
        Пожалуйста, перезагрузите страницу
        <br />
        или попробуйте зайти чуть позже.
      </p>
    </div>
  );
}

function ProjectsList() {
  const { sort, selected, duration } = useFilters();

  const durationParam: GetProjectsParams["duration"] =
    duration < DURATION_MAX ? { operator: "less", max: duration } : undefined;
  const {
    data,
    isPending,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage
  } = useProjects({
    pageSize: PAGE_SIZE,
    sortBy: SORT_MAP[sort],
    skillsId: selected.tags,
    formatId: selected.format,
    specId: selected.position,
    duration: durationParam,
  });

  if (isPending) {
    return <ProjectsGridSkeleton />;
  }

  if (isError) {
    return <ProjectsError />;
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
  return (
    <FiltersProvider>
      <PageContainer className="py-8">
        <Search />

        <div className="mb-6 flex items-center justify-between gap-4 md:hidden">
          <FiltersMobile />
          <SortMobile />
        </div>
        <FiltersBar className="mb-6 hidden md:flex" />

        <div className="md:flex md:items-start md:gap-5">
          <FiltersSidebar className="hidden md:block" />
          <div className="flex-1">
            <ProjectsCatalog catalog={<ProjectsList />} />
          </div>
        </div>
      </PageContainer>
    </FiltersProvider>
  );
}

export const Component = ProjectsPage;
