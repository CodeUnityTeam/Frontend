import { apiClient } from "@/shared/api";
import {
  mapPerson,
  type PersonDto,
} from "@/entities/profile/api/person-mapper";
import type {
  GetPeopleParams,
  PeoplePage,
} from "@/entities/profile/model/types";

interface PeopleResponseDto {
  items?: PersonDto[];
  total?: number;
  has_more?: boolean;
  results?: PersonDto[];
  count?: number;
  next?: string | null;
}

export async function getPeople(
  params: GetPeopleParams = {},
): Promise<PeoplePage> {
  const {
    page = 1,
    limit = 20,
    search,
    skillIds,
    specIds,
    formatIds,
    sortBy,
    favourites,
  } = params;

  const query: Record<string, string | number> = { page, limit };

  if (sortBy) {
    query.sort_by = sortBy;
  }
  if (skillIds && skillIds.length > 0) {
    query.skill_ids = skillIds.join(",");
  }
  if (specIds && specIds.length > 0) {
    query.spec_ids = specIds.join(",");
  }
  if (formatIds && formatIds.length > 0) {
    query.format_ids = formatIds.join(",");
  }
  if (favourites) {
    query.favourites = "true";
  }
  if (search?.trim()) {
    query.search = search.trim();
  }

  const { data } = await apiClient.get<PeopleResponseDto>("/user/profile/", {
    params: query,
  });

  const items = data.items ?? data.results ?? [];

  return {
    items: items.map(mapPerson),
    total: data.total ?? data.count ?? items.length,
    hasMore: data.has_more ?? Boolean(data.next),
  };
}
