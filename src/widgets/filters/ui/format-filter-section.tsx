import { useFormats } from "@/entities/reference";

import { ReferenceFilterSection } from "./reference-filter-section";

export function FormatFilterSection() {
  const { data, isPending, isError, refetch } = useFormats();

  return (
    <ReferenceFilterSection
      title="Формат"
      sectionId="format"
      items={data}
      isPending={isPending}
      isError={isError}
      onRetry={() => refetch()}
    />
  );
}
