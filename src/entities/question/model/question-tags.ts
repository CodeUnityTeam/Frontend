import type { QuestionTag } from "./types";

export const questionTags = [
  { value: "web", label: "Веб-разработка" },
  { value: "design", label: "Дизайн" },
  { value: "books", label: "Книги" },
  { value: "gamedev", label: "Разработка игр" },
  { value: "frameworks", label: "Фреймворки" },
  { value: "freelance", label: "Фриланс" },
  { value: "adobe", label: "Adobe" },
  { value: "android", label: "Android" },
  { value: "backend", label: "Backend" },
  { value: "figma", label: "Figma" },
  { value: "frontend", label: "Frontend" },
  { value: "git", label: "Git" },
  { value: "go", label: "Go" },
  { value: "html-css", label: "HTML/CSS" },
  { value: "ios", label: "IOS" },
  { value: "javascript", label: "JavaScript" },
  { value: "product", label: "Product" },
  { value: "python", label: "Python" },
  { value: "react", label: "React" },
  { value: "sql", label: "SQL" },
  { value: "ui-ux", label: "UI/UX" },
] as const;

export function getTagLabels(values: QuestionTag[]): string[] {
  const labels: string[] = [];
  for (const value of values) {
    const tag = questionTags.find((item) => item.value === value);
    if (tag) {
      labels.push(tag.label);
    }
  }
  return labels;
}
