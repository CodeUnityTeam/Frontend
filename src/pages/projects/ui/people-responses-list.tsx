import { Icon } from "@iconify/react";
import { Button } from "@/shared/ui/button";
import { ProjectsGridSkeleton } from "../ui/projects-grid-skeleton";
import { ProjectsError } from "../ui/projects-error";
import { ProjectsEmpty } from "../ui/projects-empty";
import { usePeopleResponses } from "@/entities/profile";
import { PAGE_SIZE } from "../lib/constants"
import {
  PersonCard,
  personResponseStatusLabels,
  personResponseStatusTextClass,
} from "@/widgets/person-card";


export function PeopleResponsesList() {
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
              responseId={response.responseId}
              responseStatus={response.status}
              onAction={() => refetch()}
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