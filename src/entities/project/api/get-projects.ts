import { apiClient } from "@/shared/api";
import type {
  GetProjectsParams,
  Project,
  ProjectsPage,
} from "@/entities/project/model/types";

interface ProjectSkillDto {
  skill_id: string;
  name: string;
}

interface ProjectDto {
  project_id: string;
  title: string;
  short_desc: string;
  location: string;
  status_project: string;
  published_at: string;
  participants_count: number;
  is_liked_by_me: boolean;
  skills: ProjectSkillDto[];
}

interface ProjectsResponseDto {
  items: ProjectDto[];
  total: number;
  has_more: boolean;
}

function mapProject(dto: ProjectDto): Project {
  return {
    projectId: dto.project_id,
    title: dto.title,
    shortDesc: dto.short_desc,
    location: dto.location,
    status: dto.status_project,
    publishedAt: dto.published_at,
    participantsCount: dto.participants_count,
    isLikedByMe: dto.is_liked_by_me,
    skills: dto.skills.map((skill) => ({
      skillId: skill.skill_id,
      name: skill.name,
    })),
  };
}

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
  } = params;

  const query: Record<string, string | number> = {
    page,
    page_size: pageSize,
  };

  if (sortBy) {
    query.sort_by = sortBy;
  }
  if (skillsId && skillsId.length > 0) {
    query.skills_id = skillsId.join(",");
  }
  if (formatId && formatId.length > 0) {
    query.format_id = formatId.join(",");
  }
  if (specId && specId.length > 0) {
    query.spec_id = specId.join(",");
  }
  if (duration) {
    query.duration_operator = duration.operator;
    if (duration.min != null) {
      query.duration_min = duration.min;
    }
    if (duration.max != null) {
      query.duration_max = duration.max;
    }
  }

  const { data } = await apiClient.get<ProjectsResponseDto>("/projects/", {
    params: query,
  });

  return {
    items: data.items.map(mapProject),
    total: data.total,
    hasMore: data.has_more,
  };
}
