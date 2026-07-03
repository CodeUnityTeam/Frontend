export type ResponseStatus =
  | "approved"
  | "pending"
  | "rejected"
  | "withdrawn";

export interface ResponseSkill {
  skillId: string;
  name: string;
}

export interface ProjectResponse {
  responseId: string;
  status: ResponseStatus;
  createdAt: string;
  projectId: string;
  title: string;
  shortDesc: string;
  location: string;
  projectStatus: string;
  publishedAt: string | null;
  participantsCount: number;
  isLikedByMe: boolean;
  authorEmail: string | null;
  authorPhone: string | null;
  skills: ResponseSkill[];
}

export interface ResponsesPage {
  items: ProjectResponse[];
  total: number;
  hasMore: boolean;
}

export interface GetResponsesParams {
  page?: number;
  limit?: number;
  status?: "all" | ResponseStatus;
  sortOrder?: "asc" | "desc";
  projectId?: string;
}
