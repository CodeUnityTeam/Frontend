export { useProjects } from "./api/use-projects";
export { useRecommendations } from "./api/use-recommendations";
export { useLikeProject } from "./api/use-like-project";
export {
  type Project,
  type ProjectDetails,
  type Author,
  type Participant,
  type Skill,
  type Specialization,
  type ProjectFormat,
  type ProjectsPage,
  type ProjectLikeResponse,
  type GetProjectsParams,
  type GetRecommendationsParams,
} from "./model/types";

export interface ProjectSkill {
  skill_id: string;
  name: string;
}
