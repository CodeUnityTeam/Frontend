import { apiClient } from "@/shared/api";
import {
  mapPerson,
  type PersonDto,
} from "@/entities/profile/api/person-mapper";
import type {
  PersonResponse,
  PersonResponsesPage,
  PersonResponseStatus,
  PersonResponseInitiator,
} from "@/entities/profile/model/types";

interface PersonResponseDto {
  response_id: string;
  project_id: string;
  project_title: string;
  initiator_type: PersonResponseInitiator;
  status_resp: PersonResponseStatus;
  profile: PersonDto;
}

interface PeopleResponsesDto {
  items?: PersonResponseDto[];
  total?: number;
  has_more?: boolean;
  results?: PersonResponseDto[];
  count?: number;
  next?: string | null;
}

interface GetPeopleResponsesParams {
  page?: number;
  limit?: number;
}

function mapPersonResponse(dto: PersonResponseDto): PersonResponse {
  return {
    responseId: dto.response_id,
    projectId: dto.project_id,
    projectTitle: dto.project_title,
    initiatorType: dto.initiator_type === "author" ? "author" : "applicant",
    status: dto.status_resp,
    person: mapPerson(dto.profile),
  };
}

export async function getPeopleResponses(
  params: GetPeopleResponsesParams = {},
): Promise<PersonResponsesPage> {
  const { page = 1, limit = 20 } = params;

  const { data } = await apiClient.get<PeopleResponsesDto>("/user/profile/", {
    params: { page, limit, responses: "true" },
  });

  const items = data.items ?? data.results ?? [];

  return {
    items: items.map(mapPersonResponse),
    total: data.total ?? data.count ?? items.length,
    hasMore: data.has_more ?? Boolean(data.next),
  };
}
