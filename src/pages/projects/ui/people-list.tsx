import { Icon } from "@iconify/react";
import { Button } from "@/shared/ui/button";
import { ProjectsGridSkeleton } from "../ui/projects-grid-skeleton";
import { ProjectsError } from "../ui/projects-error";
import { ProjectsEmpty } from "../ui/projects-empty";
import { usePeople } from "@/entities/profile";
import { useFilters } from "@/widgets/filters";
import { PAGE_SIZE, PEOPLE_SORT_MAP} from "../lib/constants"
import { PersonCard } from "@/widgets/person-card";


type PeopleListProps = {
  search: string;
  favourites?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onInvite?: (userId: string) => void;
};

export function PeopleList({
  search,
  favourites,
  emptyTitle = "Пока нет специалистов",
  emptyDescription = "Здесь появятся специалисты, как только они зарегистрируются.",
  onInvite,
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
            <PersonCard
              person={person}
              onInvite={onInvite}
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