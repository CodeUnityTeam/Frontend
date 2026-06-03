export type FilterOption = {
  value: string;
  label: string;
  count?: number;
};

export type FilterSection = {
  id: string;
  title: string;
  options: FilterOption[];
};

export type SortOption = {
  value: string;
  label: string;
};

/** Выбранные значения по каждой секции: { sectionId: ["value1", "value2"] } */
export type SelectedFilters = Record<string, string[]>;

export type FiltersController = {
  selected: SelectedFilters;
  toggle: (sectionId: string, value: string) => void;
  isChecked: (sectionId: string, value: string) => boolean;
  duration: number;
  setDuration: (value: number) => void;
  sort: string;
  setSort: (value: string) => void;
  reset: () => void;
  selectedCount: number;
};
