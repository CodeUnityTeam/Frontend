import { useSpecializations } from "@/entities/reference";

import { ReferenceFilterSection } from "./reference-filter-section";

export function PositionFilterSection() {
  const { data, isPending, isError, refetch } = useSpecializations();

  return (
    <ReferenceFilterSection
      title="Позиция"
      sectionId="position"
      searchSectionId="position"
      items={data}
      isPending={isPending}
      isError={isError}
      onRetry={() => refetch()}
      searchable
      searchPlaceholder="Поиск по специализациям"
    />
  );
}
