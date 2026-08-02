export type ResponseStatus = "pending" | "approved" | "rejected" | "withdrawn";
export type SortOrder = "asc" | "desc";
export type ResponseInitiatorType =
  | "author"
  | "applicant";

// ============ API ТИПЫ (то что приходит с бэкенда) ============

// Навык из API
export interface ApiSkill {
  skill_id: string;
  name: string;
}

export interface ResponseItem {
  response_id: string;
  response_status: ResponseStatus;
  initiator_type: "applicant" | "author";
  response_created_at: string;
  project_id: string;
  title: string;
  short_desc: string;
  skills: ApiSkill[]; 
  location: string;
  status: string;
  published_at: string | null;
  participants_count: number;
  is_liked_by_me: boolean;
  author_email?: string | null;
  author_phone?: string | null;
}

export interface ResponsesListResponse {
  items: ResponseItem[];
  total: number;
  has_more: boolean;
  page: number;
  limit: number;
  applied_filters: {
    status: "all" | ResponseStatus;
  };
}

export interface CreateResponseResponse {
  response_id: string;
  project_id: string;
  user_id: string;
  status: ResponseStatus;
  created_at: string;
}

export interface UpdateResponseStatusRequest {
  status: ResponseStatus;
}

export interface GetResponsesParams {
  page?: number;
  limit?: number;
  project_id?: string;
  sort_order?: SortOrder;
  status?: "all" | ResponseStatus;
}

// ============ UI ТИПЫ ============

export interface ResponseSkill {
  skillId: string;
  name: string;
}

export interface ProjectResponse {
  responseId: string;
  status: ResponseStatus;
  initiatorType: "applicant" | "author";
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
  page: number;
  limit: number;
  appliedFilters: {
    status: "all" | ResponseStatus;
  };
}

// ============ МАППЕРЫ ============

export function mapResponseItemToProjectResponse(item: ResponseItem): ProjectResponse {
  return {
    responseId: item.response_id,
    status: item.response_status,
    initiatorType: item.initiator_type,
    createdAt: item.response_created_at,
    projectId: item.project_id,
    title: item.title,
    shortDesc: item.short_desc,
    location: item.location ?? "",
    projectStatus: item.status,
    publishedAt: item.published_at,
    participantsCount: item.participants_count,
    isLikedByMe: item.is_liked_by_me,
    authorEmail: item.author_email ?? null,
    authorPhone: item.author_phone ?? null,
    skills: item.skills.map(skill => ({
      skillId: skill.skill_id,
      name: skill.name,
    })),
  };
}

export function mapResponsesListToUI(response: ResponsesListResponse): ResponsesPage {
  return {
    items: response.items.map(mapResponseItemToProjectResponse),
    total: response.total,
    hasMore: response.has_more,
    page: response.page,
    limit: response.limit,
    appliedFilters: response.applied_filters,
  };
}