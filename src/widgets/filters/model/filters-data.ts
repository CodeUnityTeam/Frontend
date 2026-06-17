import type { SortOption } from "./types";

export const sortOptions: SortOption[] = [
  { value: "popularity", label: "Популярности" },
  { value: "date", label: "Дате" },
  { value: "relevance", label: "Релевантности" },
];

export const DURATION_MIN = 7;
export const DURATION_MAX = 365;
export const DURATION_DEFAULT = 365;
export const DURATION_TITLE = "Длительность";
export const DURATION_FROM_LABEL = "Всего";
export const DURATION_TO_LABEL = "До года";
