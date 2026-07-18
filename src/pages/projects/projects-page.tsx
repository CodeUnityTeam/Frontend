import { Icon } from "@iconify/react";

import {
  usePeople,
  usePeopleResponses,
  useRole,
  type GetPeopleParams,
} from "@/entities/profile";
import {
  useDeleteProject,
  useProject,
  useProjects,
  type GetProjectsParams,
} from "@/entities/project";
import { useResponses } from "@/entities/response";
import { ProjectModal } from "@/features/project-modal";
import { useIsAuthed } from "@/shared/lib/auth";
import { Button } from "@/shared/ui/button";
import {
  AlertModal,
  AlertModalHeader,
  AlertModalTitle,
  AlertModalDescription,
  AlertModalFooter,
  AlertModalAction,
  AlertModalCancel,
} from "@/shared/ui/modal/alert-modal";
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
import { formatDate } from "@/shared/lib/format-date";
import { ProjectsGridSkeleton } from "./ui/projects-grid-skeleton";
import { ProjectsError } from "./ui/projects-error";
import { ProjectsEmpty } from "./ui/projects-empty";

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

type ProjectsListProps = {
  search: string;
  favourites?: boolean;
  myProject?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  isOwner?: boolean;
  onEdit?: (projectId: string) => void;
  onDelete?: (projectId: string) => void;
};

function ProjectsList({
  search,
  favourites,
  myProject,
  emptyTitle,
  emptyDescription,
  isOwner,
  onEdit,
  onDelete,
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
    search,
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
              participantsCount={project.participantsCount}
              onEdit={onEdit}
              onDelete={onDelete}
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
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [editProjectId, setEditProjectId] = useState<string | null>(null);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);

  const { data: editProject } = useProject(editProjectId ?? undefined);
  const { mutate: removeProject } = useDeleteProject();

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
          <FiltersSidebar className="hidden md:flex" />
          <div className="flex-1">
            <div className="flex items-center justify-between gap-4">
              <FilterTabs
                items={visibleTabs}
                value={activeTab}
                onValueChange={setTab}
              />
              {activeTab === "my-projects" && isEmployer && (
                <>
                  <Button
                    variant="ghost"
                    type="button"
                    className="hidden h-auto shrink-0 p-0 text-[18px] font-semibold md:flex"
                    onClick={() => setCreateModalOpen(true)}
                  >
                    Создать проект
                    <Icon icon="ph:plus-circle" />
                  </Button>
                  <Button
                    variant="ghost"
                    type="button"
                    size="icon"
                    className="shrink-0 md:hidden"
                    aria-label="Создать проект"
                    onClick={() => setCreateModalOpen(true)}
                  >
                    <Icon icon="ph:plus-circle" />
                  </Button>
                </>
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
                    onEdit={isEmployer ? setEditProjectId : undefined}
                    onDelete={isEmployer ? setDeleteProjectId : undefined}
                  />
                }
              />
            )}
          </div>
        </div>

        <ProjectModal
          open={isCreateModalOpen}
          onOpenChange={setCreateModalOpen}
          mode="create"
        />

        <ProjectModal
          open={Boolean(editProjectId)}
          onOpenChange={(open) => {
            if (!open) {
              setEditProjectId(null);
            }
          }}
          mode="edit"
          project={editProject}
        />

        <AlertModal
          open={Boolean(deleteProjectId)}
          onOpenChange={(open) => {
            if (!open) {
              setDeleteProjectId(null);
            }
          }}
        >
          <AlertModalHeader className="gap-2">
            <Icon icon="ph:trash" className="size-16 text-foreground" />
            <AlertModalTitle>Удалить проект?</AlertModalTitle>
            <AlertModalDescription className="text-base">
              Это действие приведёт к безвозвратному удалению всей информации о
              проекте
            </AlertModalDescription>
          </AlertModalHeader>
          <AlertModalFooter>
            <AlertModalAction
              onClick={() => {
                if (deleteProjectId) {
                  removeProject(deleteProjectId);
                }
              }}
            >
              Удалить
            </AlertModalAction>
            <AlertModalCancel>Отменить</AlertModalCancel>
          </AlertModalFooter>
        </AlertModal>
      </PageContainer>
    </FiltersProvider>
  );
}

export const Component = ProjectsPage;
