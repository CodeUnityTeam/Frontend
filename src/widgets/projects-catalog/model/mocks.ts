export type CatalogItem = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
  location: string;
};

export const MOCK_PROJECTS: CatalogItem[] = [
  {
    id: "1",
    title: "Чат-бот «CodeBuddy»",
    description:
      "Разрабатываем Телеграм-бота, который отвечает на типовые вопросы по отладке, синтаксису и заданиям из курсов.",
    tags: ["Python", "Flask/FastAPI", "SQLite", "Telegram Bot API", "Figma"],
    date: "15.04",
    location: "Нижний Новгород",
  },
  {
    id: "2",
    title: "Маркетплейс фриланса",
    description:
      "Платформа для поиска заказчиков и исполнителей в сфере IT. MVP с базовым поиском и системой откликов.",
    tags: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    date: "20.04",
    location: "Москва",
  },
  {
    id: "3",
    title: "Трекер задач для команд",
    description:
      "Kanban-доска с поддержкой спринтов, дедлайнов и интеграцией с GitHub для небольших продуктовых команд.",
    tags: ["Vue.js", "Nest.js", "MongoDB", "Docker"],
    date: "01.05",
    location: "Санкт-Петербург",
  },
  {
    id: "4",
    title: "Мобильное приложение для фитнеса",
    description:
      "iOS/Android приложение с трекингом тренировок, интеграцией с Apple Health и персональными рекомендациями.",
    tags: ["React Native", "Firebase", "TypeScript"],
    date: "10.05",
    location: "Казань",
  },
  {
    id: "5",
    title: "Сервис аналитики продаж",
    description:
      "Дашборд для малого бизнеса: визуализация выручки, ABC-анализ ассортимента, прогнозирование на основе ML.",
    tags: ["Python", "Pandas", "FastAPI", "React", "Chart.js"],
    date: "18.05",
    location: "Екатеринбург",
  },
  {
    id: "6",
    title: "Платформа онлайн-обучения",
    description:
      "EdTech-стартап: видеокурсы, тесты, сертификаты и система прогресса для учеников и преподавателей.",
    tags: ["Next.js", "Django", "PostgreSQL", "AWS S3"],
    date: "25.05",
    location: "Новосибирск",
  },
];

export const MOCK_PROFILES: CatalogItem[] = [
  {
    id: "1",
    title: "Иван Петров — Frontend-разработчик",
    description:
      "3 года опыта в React и TypeScript. Ищу интересный проект на part-time. Быстро вхожу в контекст.",
    tags: ["React", "TypeScript", "CSS", "Figma"],
    date: "12.04",
    location: "Москва",
  },
  {
    id: "2",
    title: "Мария Соколова — UX/UI дизайнер",
    description:
      "Специализируюсь на продуктовом дизайне. Портфолио — 15+ проектов в финтехе и edtech.",
    tags: ["Figma", "Prototyping", "UX Research", "Principle"],
    date: "14.04",
    location: "Санкт-Петербург",
  },
  {
    id: "3",
    title: "Алексей Кузнецов — Backend-разработчик",
    description:
      "Python/Django, PostgreSQL. Ищу стартап с нуля или зрелый продукт. Открыт к удалёнке.",
    tags: ["Python", "Django", "PostgreSQL", "Docker"],
    date: "16.04",
    location: "Казань",
  },
  {
    id: "4",
    title: "Елена Смирнова — QA-инженер",
    description:
      "Автоматизация на Selenium и Playwright. Опыт работы в Agile-командах, 4 года в тестировании.",
    tags: ["Selenium", "Playwright", "Python", "Jira"],
    date: "19.04",
    location: "Нижний Новгород",
  },
  {
    id: "5",
    title: "Дмитрий Воронов — Data Scientist",
    description:
      "ML-модели, NLP, компьютерное зрение. Ищу проект с реальными данными и бизнес-задачами.",
    tags: ["Python", "PyTorch", "scikit-learn", "SQL"],
    date: "22.04",
    location: "Екатеринбург",
  },
  {
    id: "6",
    title: "Ольга Николаева — Project Manager",
    description:
      "Управление командами до 10 человек. Опыт запуска 8 продуктов от идеи до релиза.",
    tags: ["Scrum", "Jira", "Confluence", "Notion"],
    date: "28.04",
    location: "Москва",
  },
];

export const PAGE_SIZE = 4;

/**
 * Имитация сетевого запроса за карточками каталога.
 * Когда появится эндпоинт — заменить тело функции на запрос
 */
export function fetchCatalogItems(
  role: "worker" | "employer",
): Promise<CatalogItem[]> {
  const items = role === "worker" ? MOCK_PROJECTS : MOCK_PROFILES;

  return new Promise((resolve) => {
    setTimeout(() => resolve(items), 400);
  });
}
