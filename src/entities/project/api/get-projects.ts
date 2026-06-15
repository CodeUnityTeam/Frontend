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
  const { page = 1, pageSize = 20 } = params;

  const { data } = await apiClient.get<ProjectsResponseDto>("/projects/", {
    params: { page, page_size: pageSize },
  });

  return {
    items: data.items.map(mapProject),
    total: data.total,
    hasMore: data.has_more,
  };
}
