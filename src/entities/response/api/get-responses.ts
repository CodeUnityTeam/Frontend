import { apiClient } from "@/shared/api";
import type {
  GetResponsesParams,
  ProjectResponse,
  ResponsesPage,
  ResponseStatus,
  ResponsesListResponse,
  ResponseItem,
} from "@/entities/response/model/types";
import { mapResponseItemToProjectResponse } from "@/entities/response/model/types";

const RESPONSE_STATUSES: ResponseStatus[] = [
  "pending",
  "approved",
  "rejected",
  "withdrawn",
];

function mapStatus(raw: string): ResponseStatus {
  return (RESPONSE_STATUSES as string[]).includes(raw)
    ? (raw as ResponseStatus)
    : "pending";
}

function mapResponse(item: ResponseItem): ProjectResponse {
  const mappedItem: ResponseItem = {
    ...item,
    response_status: mapStatus(item.response_status),
  };
  return mapResponseItemToProjectResponse(mappedItem);
}

export async function getResponses(
  params: GetResponsesParams = {},
): Promise<ResponsesPage> {
  const { page = 1, limit = 20, status, sort_order, project_id } = params;

  const query: Record<string, string | number> = { page, limit };

  if (status && status !== "all") {
    query.status = status;
  }
  if (sort_order) {
    query.sort_order = sort_order;
  }
  if (project_id) {
    query.project_id = project_id;
  }

  const { data } = await apiClient.get<ResponsesListResponse>(
    "/projects/responses/",
    { params: query },
  );

  return {
    items: data.items.map(mapResponse),
    total: data.total,
    hasMore: data.has_more,
    page: data.page,
    limit: data.limit,
    appliedFilters: data.applied_filters,
  };
}