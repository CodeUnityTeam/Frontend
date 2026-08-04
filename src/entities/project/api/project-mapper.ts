import type { Project, ProjectStatus } from "@/entities/project/model/types";

export interface ProjectSkillDto {
  skill_id: string;
  name: string;
}

export interface ProjectDto {
  project_id: string;
  title: string;
  short_desc: string;
  location: string;
  status_project: string;
  published_at: string | null;
  participants_count: number;
  is_liked_by_me: boolean;
  is_favorite_by_me: boolean;
  skills: ProjectSkillDto[];
}

export interface ProjectsResponseDto {
  items: ProjectDto[];
  total: number;
  has_more: boolean;
}

export function mapProject(dto: ProjectDto): Project {
  return {
    projectId: dto.project_id,
    title: dto.title,
    shortDesc: dto.short_desc,
    location: dto.location,
    status: dto.status_project as ProjectStatus,
    publishedAt: dto.published_at,
    participantsCount: dto.participants_count,
    isLikedByMe: dto.is_liked_by_me,
    isFavoriteByMe: dto.is_favorite_by_me,
    skills: dto.skills.map((skill) => ({
      skill_id: skill.skill_id,
      name: skill.name,
    })),
  };
}
