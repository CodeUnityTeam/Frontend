import type { FilterSection, SortOption } from "./types";

export const filterSections: FilterSection[] = [
  {
    id: "format",
    title: "Формат работы",
    options: [
      { value: "remote", label: "Удалённо", count: 15 },
      { value: "hybrid", label: "Гибрид", count: 5 },
      { value: "office", label: "В офисе", count: 8 },
    ],
  },
  {
    id: "position",
    title: "Позиция",
    options: [
      { value: "developers", label: "Разработчики", count: 10 },
      { value: "designers", label: "Дизайнеры", count: 8 },
      { value: "analysts", label: "Аналитики", count: 5 },
      { value: "product-managers", label: "Продакт-менеджеры", count: 2 },
      { value: "qa", label: "Тестировщики", count: 3 },
    ],
  },
  {
    id: "tags",
    title: "Теги",
    options: [
      { value: "project", label: "Проект" },
      { value: "team", label: "Команда" },
      { value: "beginners", label: "Для начинающих" },
      { value: "no-experience", label: "Без опыта" },
      { value: "frontend", label: "Frontend" },
      { value: "backend", label: "Backend" },
      { value: "fullstack", label: "Fullstack" },
      { value: "ui-ux", label: "UI/UX" },
      { value: "data", label: "Data" },
      { value: "product", label: "Product" },
      { value: "html-css", label: "HTML/CSS" },
      { value: "javascript", label: "JavaScript" },
      { value: "react", label: "React" },
      { value: "sql", label: "SQL" },
      { value: "python", label: "Python" },
      { value: "git", label: "Git" },
      { value: "figma", label: "Figma" },
    ],
  },
];

export const sortOptions: SortOption[] = [
  { value: "popularity", label: "Популярности" },
  { value: "date", label: "Дате" },
  { value: "relevance", label: "Релевантности" },
];

export const DURATION_MAX = 100;
export const DURATION_DEFAULT = 100;
export const DURATION_TITLE = "Длительность";
export const DURATION_FROM_LABEL = "Всего";
export const DURATION_TO_LABEL = "До года";
