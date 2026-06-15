import type { Project } from "./types";

const mockProjects: Project[] = [
  {
    id: "1",
    title: "Чат-бот «CodeBuddy»",
    description:
      "Разрабатываем Телеграм-бота, который отвечает на типовые вопросы по отладке, синтаксису и заданиям из курсов.",
    location: "Москва (удаленно)",
    startDate: "2026-04-15",
    skills: ["Python", "Flask/FastAPI", "SQLite", "Telegram Bot API"],
    specializations: ["Backend", "Frontend", "DevOps"],
    workFormats: ["Удаленно", "Гибрид"],
    status: "published",
    author: {
      id: 1,
      username: "@Alex888",
      email: "alex.designer@ya.ru",
      firstName: "Алексей",
      lastName: "Смирнов",
      avatar: "https://i.pravatar.cc/150?img=1", // Добавил аватар
    },
    participants: [
      {
        id: 1,
        user: {
          id: 1,
          username: "@Alex888",
          email: "alex@ya.ru",
          firstName: "Алексей",
          lastName: "Смирнов",
          avatar: "https://i.pravatar.cc/150?img=1",
        },
        role: "author",
      },
      {
        id: 2,
        user: {
          id: 2,
          username: "@AnnDesign",
          email: "ann@ya.ru",
          firstName: "Анна",
          lastName: "Иванова",
          avatar: "https://i.pravatar.cc/150?img=2",
        },
        role: "member",
      },
      {
        id: 3,
        user: {
          id: 3,
          username: "@DimDev",
          email: "dim@ya.ru",
          firstName: "Дмитрий",
          lastName: "Петров",
          avatar: "https://i.pravatar.cc/150?img=3",
        },
        role: "member",
      },
      {
        id: 4,
        user: {
          id: 4,
          username: "@ElenaQA",
          email: "elena@ya.ru",
          firstName: "Елена",
          lastName: "Сидорова",
          avatar: "https://i.pravatar.cc/150?img=4",
        },
        role: "member",
      },
    ],
    likesCount: 5,
    isLiked: false,
    isApplied: false,
  },
  {
    id: "2",
    title: "Мобильное приложение FitTrack",
    description:
      "Создаем приложение для отслеживания тренировок и питания с элементами геймификации.",
    location: "Санкт-Петербург",
    startDate: "2026-05-01",
    skills: ["React Native", "TypeScript", "Node.js", "MongoDB"],
    specializations: ["Mobile", "Backend", "UI/UX"],
    workFormats: ["Офис", "Гибрид"],
    status: "recruiting_closed",
    author: {
      id: 5,
      username: "@MikeFit",
      email: "mike@fit.com",
      firstName: "Михаил",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    participants: [
      {
        id: 5,
        user: {
          id: 5,
          username: "@MikeFit",
          email: "mike@fit.com",
          firstName: "Михаил",
          avatar: "https://i.pravatar.cc/150?img=5",
        },
        role: "author",
      },
    ],
    likesCount: 12,
    isLiked: true,
    isApplied: true,
  },
];

export function getProjectById(id: string): Project | undefined {
  return mockProjects.find((project) => project.id === id);
}

export function getAllProjects(): Project[] {
  return mockProjects;
}