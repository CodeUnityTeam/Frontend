import { Icon } from "@iconify/react";

import {
  usePeople,
  usePeopleResponses,
  useRole,
  type GetPeopleParams,
} from "@/entities/profile";
import { useProjects, type GetProjectsParams } from "@/entities/project";
import { useResponses } from "@/entities/response";
import { useIsAuthed } from "@/shared/lib/auth";
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
import {
  PersonCard,
  personResponseStatusLabels,
  personResponseStatusTextClass,
} from "@/widgets/person-card";
import { ProjectCard } from "@/widgets/project-card";
import { ProjectsCatalog } from "@/widgets/projects-catalog";
import { ResponseCard } from "@/widgets/response-card";
import { Search } from "@/widgets/search";
import { FilterTabs, projectTabs } from "@/widgets/filter-tabs";
import { useState } from "react";


const PAGE_SIZE = 20;

const SORT_MAP: Record<string, GetProjectsParams["sortBy"]> = {
  popularity: "like",
  date: "published_at",
  relevance: "relevance",
};

const PEOPLE_SORT_MAP: Record<string, GetPeopleParams["sortBy"]> = {
  popularity: "popularity",
  date: "newest",
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

function ProjectsError({
  onRetry,
  message = "Не удалось загрузить проекты. Попробуйте ещё раз.",
}: {
  onRetry: () => void;
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="text-muted-foreground">{message}</p>
      <Button type="button" onClick={onRetry}>
        Повторить
      </Button>
    </div>
  );
}

function ProjectsEmpty({
  title = "Пока нет проектов",
  description = "Здесь появятся проекты, как только их опубликуют. Загляните чуть позже.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-muted px-6 py-16 text-center">
      <Icon icon="ph:folder-dashed" className="size-12 text-muted-foreground" />
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

type ProjectsListProps = {
  search: string;
  favourites?: boolean;
  myProject?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  isOwner?: boolean;
};

function ProjectsList({
  search,
  favourites,
  myProject,
  emptyTitle,
  emptyDescription,
  isOwner,
}: ProjectsListProps) {
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
    favourites,
    myProject,
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
    return <ProjectsEmpty title={emptyTitle} description={emptyDescription} />;
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
              isFavoriteByMe={project.isFavoriteByMe}
              isOwner={isOwner}
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

function ResponsesList() {
  const {
    data,
    isPending,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useResponses({ limit: PAGE_SIZE });

  if (isPending) {
    return <ProjectsGridSkeleton />;
  }

  if (isError) {
    return (
      <ProjectsError
        onRetry={() => refetch()}
        message="Не удалось загрузить отклики. Попробуйте ещё раз."
      />
    );
  }

  const responses = data.pages.flatMap((page) => page.items);

  if (responses.length === 0) {
    return (
      <ProjectsEmpty
        title="Пока нет откликов"
        description="Откликайтесь на проекты — ваши заявки появятся здесь."
      />
    );
  }

  const total = data.pages[0]?.total ?? responses.length;
  const remaining = Math.max(total - responses.length, 0);

  return (
    <>
      <ul className="grid grid-cols-1 gap-4 md:auto-rows-fr md:grid-cols-[repeat(auto-fill,minmax(273px,1fr))] md:gap-x-3.5">
        {responses.map((response) => (
          <li key={response.responseId}>
            <ResponseCard response={response} />
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

type PeopleListProps = {
  search: string;
  favourites?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
};

function PeopleList({
  search,
  favourites,
  emptyTitle = "Пока нет специалистов",
  emptyDescription = "Здесь появятся специалисты, как только они зарегистрируются.",
}: PeopleListProps) {
  const { sort, selected } = useFilters();

  const {
    data,
    isPending,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = usePeople({
    limit: PAGE_SIZE,
    sortBy: PEOPLE_SORT_MAP[sort],
    skillIds: selected.tags,
    specIds: selected.position,
    formatIds: selected.format,
    favourites,
    search,
  });

  if (isPending) {
    return <ProjectsGridSkeleton />;
  }

  if (isError) {
    return (
      <ProjectsError
        onRetry={() => refetch()}
        message="Не удалось загрузить специалистов. Попробуйте ещё раз."
      />
    );
  }

  const people = data.pages.flatMap((page) => page.items);

  if (people.length === 0) {
    return <ProjectsEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const total = data.pages[0]?.total ?? people.length;
  const remaining = Math.max(total - people.length, 0);

  return (
    <>
      <ul className="grid grid-cols-1 gap-4 md:auto-rows-fr md:grid-cols-[repeat(auto-fill,minmax(273px,1fr))] md:gap-x-3.5">
        {people.map((person) => (
          <li key={person.userId}>
            <PersonCard person={person} />
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

function PeopleResponsesList() {
  const {
    data,
    isPending,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = usePeopleResponses({ limit: PAGE_SIZE });

  if (isPending) {
    return <ProjectsGridSkeleton />;
  }

  if (isError) {
    return (
      <ProjectsError
        onRetry={() => refetch()}
        message="Не удалось загрузить отклики. Попробуйте ещё раз."
      />
    );
  }

  const responses = data.pages.flatMap((page) => page.items);

  if (responses.length === 0) {
    return (
      <ProjectsEmpty
        title="Пока нет откликов"
        description="Здесь появятся отклики соискателей на ваши проекты."
      />
    );
  }

  const total = data.pages[0]?.total ?? responses.length;
  const remaining = Math.max(total - responses.length, 0);

  return (
    <>
      <ul className="grid grid-cols-1 gap-4 md:auto-rows-fr md:grid-cols-[repeat(auto-fill,minmax(273px,1fr))] md:gap-x-3.5">
        {responses.map((response) => (
          <li key={response.responseId}>
            <PersonCard
              person={response.person}
              badge={personResponseStatusLabels[response.status]}
              badgeClassName={personResponseStatusTextClass[response.status]}
              note={`${
                response.initiator === "author"
                  ? "Приглашение в проект"
                  : "Отклик на проект"
              } «${response.projectTitle}»`}
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
  const isAuthed = useIsAuthed();
  const { role, isRolePending } = useRole();
  const [tab, setTab] = useState("catalog");
  const [search, setSearch] = useState("");

  const isEmployer = role === "employer";

  const visibleTabs = isAuthed
  ? isEmployer
    ? projectTabs
    : projectTabs.filter((item) => item.value !== "my-projects")
  : projectTabs.filter((item) => item.value === "catalog");
  const activeTab = isAuthed ? tab : "catalog";

  const catalogContent = isEmployer ? (
    <PeopleList search={search} />
  ) : (
    <ProjectsList search={search} />
  );

  const favoritesContent = isEmployer ? (
    <PeopleList
      search={search}
      favourites
      emptyTitle="В избранном пусто"
      emptyDescription="Добавляйте специалистов в избранное — нажимайте на сердечко в карточке."
    />
  ) : (
    <ProjectsList
      search={search}
      favourites
      emptyTitle="В избранном пусто"
      emptyDescription="Добавляйте проекты в избранное — нажимайте на сердечко в карточке."
    />
  );

  const responsesContent = isEmployer ? (
    <PeopleResponsesList />
  ) : (
    <ResponsesList />
  );

  return (
    <FiltersProvider>
      <PageContainer className="py-8">
        <Search onSearch={setSearch} placeholder="Поиск проектов и команд" />

        <div className="mb-6 flex items-center justify-between gap-4 md:hidden">
          <FiltersMobile />
          <SortMobile />
        </div>
        <FiltersBar className="mb-6 hidden md:flex" />

        <div className="md:flex md:items-start md:gap-5">
          <FiltersSidebar className="hidden md:block" />
          <div className="flex-1">
            <div className="flex items-center justify-between gap-4">
              <FilterTabs
                items={visibleTabs}
                value={activeTab}
                onValueChange={setTab}
              />
              {activeTab === "my-projects" && isEmployer && (
                <Button
                  variant="ghost"
                  type="button"
                  className="hidden h-auto shrink-0 p-0 text-[18px] font-semibold md:flex"
                >
                  Создать проект
                  <Icon icon="ph:plus-circle" />
                </Button>
              )}
            </div>
            {isRolePending ? (
              <ProjectsGridSkeleton />
            ) : (
              <ProjectsCatalog
                tab={activeTab}
                catalog={catalogContent}
                favorites={favoritesContent}
                responses={responsesContent}
                myProjects={
                  <ProjectsList
                    search={search}
                    myProject
                    emptyTitle="У вас пока нет проектов"
                    emptyDescription="Создайте проект или присоединитесь к существующему — они появятся здесь."
                    isOwner
                  />
                }
              />
            )}
          </div>
        </div>
      </PageContainer>
    </FiltersProvider>
  );
}

export const Component = ProjectsPage;
