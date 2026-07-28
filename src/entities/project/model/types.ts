import type { ProjectsRelation } from "@/entities/profile/model/types";

export interface Skill {
  skill_id: string;
  name: string;
}

export interface Project {
  projectId: string;
  title: string;
  shortDesc: string;
  location: string;
  status: ProjectStatus;
  publishedAt: string | null;
  participantsCount: number;
  isLikedByMe: boolean;
  isFavoriteByMe: boolean;
  skills: Skill[];
}

export interface ProjectsPage {
  items: Project[];
  total: number;
  hasMore: boolean;
}

export interface ProjectLikeResponse {
  liked: boolean;
  likesCount: number;
}

export interface ProjectFavoriteResponse {
  favorited: boolean;
}

export interface Specialization {
  spec_id: string;
  name: string;
}

export interface ProjectFormat {
  format_id: string;
  name: string;
}

export interface GetProjectsParams {
  page?: number;
  pageSize?: number;
  sortBy?: "like" | "published_at" | "relevance";
  skillsId?: string[];
  formatId?: string[];
  specId?: string[];
  duration?: {
    operator: "less" | "greater" | "between";
    min?: number;
    max?: number;
  };
  search?: string;
  favourites?: boolean;
  myProject?: boolean;
  status?: "draft" | "published" | "recruiting_closed";
}

export interface GetRecommendationsParams {
  page?: number;
  limit?: number;
}

export interface Author {
  user_id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  phone_number?: string;
  last_activity_at?: string | null;
}


export interface Participant {
  avatar_url?: string;
  full_name?: string;
  user_id: string;
}

export interface ProjectDetails {
  project_id: string;
  title: string;
  short_desc: string;
  full_desc: string;
  location: string;
  status_project:
    | "draft"
    | "published"
    | "recruiting_closed"
    | "archived"
    | "blocked";
  published_at: string;
  start_date: string;
  end_date: string;
  participants_count: number;
  is_liked_by_me: boolean;
  is_favorite_by_me: boolean;
  likes_count: number;
  skills: Skill[];
  specializations: Specialization[];
  project_format: ProjectFormat[];
  author: Author;
  participants: Participant[];
}

export type ProjectRole = "employer" | "worker";

export interface UserProfile {
  pk: string;
  email: string;
  role: ProjectsRelation;
  projects_relation: ProjectsRelation;
}

export type ProjectStatus =
  | "draft"
  | "published"
  | "recruiting_closed"
  | "archived"
  | "blocked";

export type InviteProject = Pick<
  Project,
  "projectId" | "title" | "shortDesc"
>;