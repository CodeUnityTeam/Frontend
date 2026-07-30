import { Icon } from "@iconify/react";
import { Button } from "@/shared/ui/button";
import { ProjectsGridSkeleton } from "../ui/projects-grid-skeleton";
import { ProjectsError } from "../ui/projects-error";
import { ProjectsEmpty } from "../ui/projects-empty";
import { useResponses } from "@/entities/response";
import { PAGE_SIZE } from "../lib/constants"
import { ResponseCard } from "@/widgets/response-card";
import { useRole } from "@/entities/profile";

export function ProjectsResponsesList() {
  const {
    data,
    isPending,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useResponses({ limit: PAGE_SIZE });
  
  const { role, isRolePending } = useRole();

  if (isPending || isRolePending) {
    return <ProjectsGridSkeleton />;
  }

  if (!role) {
    return null;
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
            <ResponseCard response={response} role={role} />
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