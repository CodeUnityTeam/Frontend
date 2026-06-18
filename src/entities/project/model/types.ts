export interface UserShort {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName?: string;
  avatar?: string;
  phone?: string;
}

export type ProjectAuthor = UserShort;

export interface ProjectParticipant {
  id: number;
  role: "author" | "member";
  user: UserShort;
}

export type ProjectStatus =
  | "draft" 
  | "published" 
  | "recruiting_closed" 
  | "archived" 
  | "blocked"; 

 
export interface Project {
  id: string;
  title: string;
  description: string;
  location?: string;
  startDate: string;
  skills: string[];
  specializations: string[];
  workFormats?: string[];
  participants: ProjectParticipant[];
  likesCount: number;
  isLiked: boolean;
  isApplied: boolean;
  status?: ProjectStatus;
  author: ProjectAuthor;
}
