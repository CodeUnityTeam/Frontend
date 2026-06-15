export interface ProjectSkill {
  skillId: string;
  name: string;
}

export interface Project {
  projectId: string;
  title: string;
  shortDesc: string;
  location: string;
  status: string;
  publishedAt: string;
  participantsCount: number;
  isLikedByMe: boolean;
  skills: ProjectSkill[];
}

export interface ProjectsPage {
  items: Project[];
  total: number;
  hasMore: boolean;
}

export interface GetProjectsParams {
  page?: number;
  pageSize?: number;
}
