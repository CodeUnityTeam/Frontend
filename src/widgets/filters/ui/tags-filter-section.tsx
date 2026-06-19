import { useMemo } from "react";

import { useSkills } from "@/entities/skill";

import { ReferenceFilterSection } from "./reference-filter-section";

export function TagsFilterSection() {
  const { data, isPending, isError, refetch } = useSkills();
  const items = useMemo(
    () => data?.map((skill) => ({ id: skill.skillId, name: skill.name })),
    [data],
  );

  return (
    <ReferenceFilterSection
      title="Теги"
      sectionId="tags"
      items={items}
      isPending={isPending}
      isError={isError}
      onRetry={() => refetch()}
      searchable
      searchPlaceholder="Поиск по тегам"
    />
  );
}
