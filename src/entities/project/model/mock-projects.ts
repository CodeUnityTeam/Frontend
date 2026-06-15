import type { Project } from "./types";

export const mockProject: Project = {
  id: "1",
  title: "Чат-бот «CodeBuddy»",
  description:
    "Разрабатываем Telegram-бота, который отвечает на типовые вопросы по отладке, синтаксису и заданиям из курсов.",

  startDate: "15 апреля, 2026",

  skills: [
    "Python",
    "Flask/FastAPI",
    "SQLite",
    "Telegram Bot API",
    "Figma",
  ],

  specializations: [
    "Разработчиков (backend, frontend, fullstack)",
    "DevOps-инженеров, системных администраторов",
    "UX/UI дизайнеров",
    "Аналитиков данных и Data Scientists",
    "Тестировщиков и QA-специалистов",
    "Менеджеров IT-проектов",
  ],

  status: "published",

  author: {
    id: 1,
    username: "Alex888",
    email: "alex.designer@ya.ru",
    firstName: "Алексей",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
  },

  participants: [
    {
      id: 1,
      role: "author",
      user: {
        id: 1,
        username: "Alex888",
        email: "alex.designer@ya.ru",
        firstName: "Алексей",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
        phone: "+7 (999) 123-45-67",
      },
    },
    {
      id: 2,
      role: "member",
      user: {
        id: 2,
        username: "ivan_dev",
        email: "ivan@example.com",
        firstName: "Иван",
        avatar:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80",
      },
    },
    {
      id: 3,
      role: "member",
      user: {
        id: 3,
        username: "anna_ui",
        email: "anna@example.com",
        firstName: "Анна",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
      },
    },
    {
      id: 4,
      role: "member",
      user: {
        id: 4,
        username: "max_qa",
        email: "max@example.com",
        firstName: "Максим",
        avatar:
          "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=200&q=80",
      },
    },
  ],

  likesCount: 10,

  isLiked: false,

  isApplied: false,
};

export const mockProjects: Project[] = [mockProject];