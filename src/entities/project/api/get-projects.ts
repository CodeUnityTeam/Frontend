import { apiClient } from "@/shared/api";
import type {
  GetProjectsParams,
  ProjectsPage,
} from "@/entities/project/model/types";
import {
  mapProject,
  type ProjectsResponseDto,
} from "@/entities/project/api/project-mapper";

export async function getProjects(
  params: GetProjectsParams = {},
): Promise<ProjectsPage> {
  const {
    page = 1,
    pageSize = 20,
    sortBy,
    skillsId,
    formatId,
    specId,
    duration,
    favourites,
    myProject,
    search
  } = params;

  const { data } = await apiClient.get<ProjectsResponseDto>("/projects/", {
    params: {
      page,
      limit: pageSize,
      ...(sortBy && { sort_by: sortBy }),
      ...(skillsId && skillsId?.length > 0 && { skills_id: skillsId.join(",") }),
      ...(formatId && formatId?.length > 0 && { format_id: formatId.join(",") }),
      ...(specId && specId?.length > 0 && { spec_id: specId.join(",") }),
      ...(duration?.operator && { duration_operator: duration.operator }),
      ...(duration?.min && { duration_min: duration.min }),
      ...(duration?.max && { duration_max: duration.max }),
      ...(favourites && { favourites }),
      ...(myProject && { my_project: "true" }),
      ...(search?.trim() && { search: search.trim() }),
      /*
        TO DO: ДОБАВИТЬ ПАРАМЕТРЫ ДЛЯ БЭКОВ (#11_июля)

        load_more	
        boolean
        Флаг подгрузки (бесконечный скролл)

        sort_by	
        string
        Enum: "like" "published_at" "relevance"
        Сортировка: like (по лайкам),published_at (по дате публикации), relevance (по релевантности — только при наличии search).По умолчанию: published_at.

        status	
        string
        Enum: "draft" "published" "recruiting_closed"
        Статус проекта: draft, published, recruiting_closed. При фильтрации по специализации проекты со статусом recruiting_closed не отображаются.
      */ 
    },
  });

  return {
    items: data.items.map(mapProject),
    total: data.total,
    hasMore: data.has_more,
  };
}
