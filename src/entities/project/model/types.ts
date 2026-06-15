export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string; 
}

export interface ProjectParticipant {
  id: number;
  user: User;
  role: "author" | "member";
}

export interface Project {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  skills: string[];
  specializations: string[];
  workFormats: string[];
  status: "draft" | "published" | "recruiting_closed" | "archived" | "blocked";
  author: User;
  participants: ProjectParticipant[];
  likesCount: number;
  isLiked: boolean;
  isApplied: boolean;
}