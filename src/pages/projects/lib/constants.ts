import type {
    GetPeopleParams,
} from "@/entities/profile";

import type {
    GetProjectsParams,
} from "@/entities/project";

export const PAGE_SIZE = 20;

export const SORT_MAP: Record<string, GetProjectsParams["sortBy"]> = {
    popularity: "like",
    date: "published_at",
    relevance: "relevance",
};

export const PEOPLE_SORT_MAP: Record<
    string,
    GetPeopleParams["sortBy"]
> = {
    popularity: "popularity",
    date: "newest",
    relevance: "relevance",
};