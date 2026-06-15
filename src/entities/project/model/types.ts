// Краткая информация о пользователе
export interface UserShort {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName?: string;
  avatar?: string;
  phone?: string;
}

// Автор проекта
export type ProjectAuthor = UserShort;

// Участник проекта
export interface ProjectParticipant {
  id: number;
  role: "author" | "member";
  user: UserShort;
}

// Статус проекта
export type ProjectStatus =
  | "draft" // Черновик, виден только автору
  | "published" // Опубликован, виден всем
  | "recruiting_closed" // Набор закрыт
  | "archived" // Заархивирован
  | "blocked"; // Заблокирован

  // Основной интерфейс проекта
export interface Project {
  id: string;
  title: string;
  description: string;
  location?: string;
  startDate: string;
  skills: string[];
  specializations: string[];
  workFormats?: string[];
  participants: ProjectParticipant[];// Список участников проекта
  likesCount: number;
  isLiked: boolean;
  isApplied: boolean;
  status?: ProjectStatus;
  author: ProjectAuthor;
}
