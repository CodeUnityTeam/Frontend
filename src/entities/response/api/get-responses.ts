import { apiClient } from "@/shared/api";
import type {
  GetResponsesParams,
  ProjectResponse,
  ResponsesPage,
  ResponseStatus,
} from "@/entities/response/model/types";

interface FeedSkillDto {
  skill_id?: string;
  name?: string;
}

interface FeedItemDto {
  response_id: string;
  response_status: string;
  response_created_at: string;
  project_id: string;
  title: string;
  short_desc: string;
  location: string | null;
  status: string;
  published_at: string | null;
  participants_count: number;
  is_liked_by_me: boolean;
  author_email: string | null;
  author_phone: string | null;
  skills: FeedSkillDto[];
}

interface ResponsesFeedDto {
  items?: FeedItemDto[];
  total?: number;
  has_more?: boolean;
  results?: FeedItemDto[];
  count?: number;
  next?: string | null;
}

const RESPONSE_STATUSES: ResponseStatus[] = [
  "approved",
  "pending",
  "rejected",
  "withdrawn",
];

function mapStatus(raw: string): ResponseStatus {
  return (RESPONSE_STATUSES as string[]).includes(raw)
    ? (raw as ResponseStatus)
    : "pending";
}

function mapResponse(dto: FeedItemDto): ProjectResponse {
  return {
    responseId: dto.response_id,
    status: mapStatus(dto.response_status),
    createdAt: dto.response_created_at,
    projectId: dto.project_id,
    title: dto.title,
    shortDesc: dto.short_desc,
    location: dto.location ?? "",
    projectStatus: dto.status,
    publishedAt: dto.published_at,
    participantsCount: dto.participants_count,
    isLikedByMe: dto.is_liked_by_me,
    authorEmail: dto.author_email,
    authorPhone: dto.author_phone,
    skills: (dto.skills ?? [])
      .filter((skill) => Boolean(skill.name))
      .map((skill) => ({
        skillId: skill.skill_id ?? "",
        name: skill.name ?? "",
      })),
  };
}

export async function getResponses(
  params: GetResponsesParams = {},
): Promise<ResponsesPage> {
  const { page = 1, limit = 20, status, sortOrder, projectId } = params;

  const query: Record<string, string | number> = { page, limit };

  if (status) {
    query.status = status;
  }
  if (sortOrder) {
    query.sort_order = sortOrder;
  }
  if (projectId) {
    query.project_id = projectId;
  }

  const { data } = await apiClient.get<ResponsesFeedDto>(
    "/projects/responses/",
    { params: query },
  );

  const items = data.items ?? data.results ?? [];

  return {
    items: items.map(mapResponse),
    total: data.total ?? data.count ?? items.length,
    hasMore: data.has_more ?? Boolean(data.next),
  };
}
