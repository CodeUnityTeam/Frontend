import type { TabItem } from "./types";

export const qaTabs = [
  { value: "new", label: "Новое" },
  { value: "popular", label: "Популярное" },
  { value: "unanswered", label: "Вопросы без ответа" },
  { value: "my-questions", label: "Мои вопросы" },
] as const satisfies readonly TabItem[];

export const projectTabs = [
  { value: "catalog", label: "Каталог" },
  { value: "favorites", label: "Избранное" },
  { value: "responses", label: "Отклики" },
  { value: "my-projects", label: "Мои проекты" },
] as const satisfies readonly TabItem[];
