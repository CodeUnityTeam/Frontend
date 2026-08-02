export type { ProjectsRelation } from "@/shared/api/profile";

export interface PersonSkill {
  skillId: string;
  name: string;
}

export interface PersonSpecialization {
  specId: string;
  name: string;
}

export interface PersonWorkFormat {
  formatId: string;
  name: string;
}

export interface Person {
  userId: string;
  firstName: string;
  lastName: string;
  city: string;
  avatarUrl: string;
  isLiked: boolean;
  rating: number;
  skills: PersonSkill[];
  specializations: PersonSpecialization[];
  workformats: PersonWorkFormat[];
}

export interface PeoplePage {
  items: Person[];
  total: number;
  hasMore: boolean;
}

export interface GetPeopleParams {
  page?: number;
  limit?: number;
  search?: string;
  skillIds?: string[];
  specIds?: string[];
  formatIds?: string[];
  sortBy?: "newest" | "popularity" | "relevance";
  favourites?: boolean;
}

export type PersonResponseStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "withdrawn";

export type PersonResponseInitiator = "applicant" | "author";

export interface PersonResponse {
  responseId: string;
  projectId: string;
  projectTitle: string;
  initiatorType: PersonResponseInitiator;
  status: PersonResponseStatus;
  person: Person;
}

export interface PersonResponsesPage {
  items: PersonResponse[];
  total: number;
  hasMore: boolean;
}
