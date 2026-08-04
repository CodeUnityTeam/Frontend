import { useMemo, useState } from "react";

import { DURATION_DEFAULT, sortOptions } from "./filters-data";
import type { FiltersController, SelectedFilters } from "./types";

export function useFiltersController(): FiltersController {
  const [selected, setSelected] = useState<SelectedFilters>({});
  const [duration, setDuration] = useState(DURATION_DEFAULT);
  const [sort, setSort] = useState(sortOptions[0].value);
  const [search, setSearchState] = useState<Record<string, string>>({});

  const toggle = (sectionId: string, value: string) => {
    setSelected((prev) => {
      const current = prev[sectionId] ?? [];
      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];

      return { ...prev, [sectionId]: next };
    });
  };

  const isChecked = (sectionId: string, value: string) =>
    (selected[sectionId] ?? []).includes(value);

  const setSearch = (sectionId: string, value: string) => {
    setSearchState((prev) => ({ ...prev, [sectionId]: value }));
  };

  const reset = () => {
    setSelected({});
    setDuration(DURATION_DEFAULT);
    setSearchState({});
  };

  const selectedCount = useMemo(
    () =>
      Object.values(selected).reduce(
        (total, values) => total + values.length,
        0,
      ),
    [selected],
  );

  return {
    selected,
    toggle,
    isChecked,
    duration,
    setDuration,
    sort,
    setSort,
    reset,
    selectedCount,
    search, 
    setSearch,
  };
}
