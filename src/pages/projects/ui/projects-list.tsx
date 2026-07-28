import { Icon } from "@iconify/react";
import { Button } from "@/shared/ui/button";
import { ProjectsGridSkeleton } from "../ui/projects-grid-skeleton";
import { ProjectsError } from "../ui/projects-error";
import { ProjectsEmpty } from "../ui/projects-empty";
import {
  useProjects,
  type GetProjectsParams,
} from "@/entities/project";
import {
  useFilters,
  DURATION_MAX,
} from "@/widgets/filters";
import { PAGE_SIZE, SORT_MAP} from "../lib/constants"
import { ProjectCard } from "@/widgets/project-card";
import { formatDate } from "@/shared/lib/format-date";

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

export function ProjectsList({
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