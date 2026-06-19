export type SortOption = {
  value: string;
  label: string;
};

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
