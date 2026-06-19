import type { ProjectDetails } from "./types";

export const mockProject: ProjectDetails = {
  project_id: "1",
  title: "Чат-бот «CodeBuddy»",
  short_desc: "Разрабатываем Telegram-бота, который отвечает на типовые вопросы по отладке, синтаксису и заданиям из курсов.",
  full_desc: "Разрабатываем Telegram-бота, который отвечает на типовые вопросы по отладке, синтаксису и заданиям из курсов. В проекте участвуют 4 разработчика.",
  location: "Москва (удаленно)",
  status_project: "published",
  published_at: "2026-03-15T10:30:00Z",
  start_date: "2026-04-15",
  end_date: "2026-04-15",
  participants_count: 4,
  is_liked_by_me: false,
  is_applied: false,
  likes_count: 10,
  skills: [
    { skill_id: "1", name: "Python" },
    { skill_id: "2", name: "Flask/FastAPI" },
    { skill_id: "3", name: "SQLite" },
    { skill_id: "4", name: "Telegram Bot API" },
    { skill_id: "5", name: "Figma" },
  ],
  specializations: [
    { spec_id: "1", name: "Разработчиков (backend, frontend, fullstack)" },
    { spec_id: "2", name: "DevOps-инженеров, системных администраторов" },
    { spec_id: "3", name: "UX/UI дизайнеров" },
    { spec_id: "4", name: "Аналитиков данных и Data Scientists" },
    { spec_id: "5", name: "Тестировщиков и QA-специалистов" },
    { spec_id: "6", name: "Менеджеров IT-проектов" },
  ],
  project_format: [
    { format_id: "1", name: "Удаленно" },
    { format_id: "2", name: "Гибрид" },
  ],
  author: {
    user_id: "1",
    username: "Alex888",
    email: "alex.designer@ya.ru",
    first_name: "Алексей",
    last_name: "Смирнов",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    phone: "+7 (999) 123-45-67",
  },
  participants: [
    {
      participant_id: "1",
      role: "author",
      user: {
        user_id: "1",
        username: "Alex888",
        email: "alex.designer@ya.ru",
        first_name: "Алексей",
        last_name: "Смирнов",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
        phone: "+7 (999) 123-45-67",
      },
    },
    {
      participant_id: "2",
      role: "member",
      user: {
        user_id: "2",
        username: "ivan_dev",
        email: "ivan@example.com",
        first_name: "Иван",
        last_name: "Петров",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80",
      },
    },
    {
      participant_id: "3",
      role: "member",
      user: {
        user_id: "3",
        username: "anna_ui",
        email: "anna@example.com",
        first_name: "Анна",
        last_name: "Иванова",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
      },
    },
    {
      participant_id: "4",
      role: "member",
      user: {
        user_id: "4",
        username: "max_qa",
        email: "max@example.com",
        first_name: "Максим",
        last_name: "Сидоров",
        avatar: "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=200&q=80",
      },
    },
  ],
};

export const mockProjects: ProjectDetails[] = [mockProject];