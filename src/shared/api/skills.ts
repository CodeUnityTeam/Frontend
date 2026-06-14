import {
  AUTH_REQUEST_CREDENTIALS,
  createApiRequestError,
  parseJsonSafe,
} from "./auth";

export type SkillCatalogItem = {
  id: string;
  name: string;
};

let skillCatalogPromise: Promise<SkillCatalogItem[]> | null = null;

function getApiUrl(path: string): string {
  const base = import.meta.env.VITE_API_URL as string;
  return `${base.replace(/\/$/, "")}${path}`;
}

export async function fetchSkillCatalog(): Promise<SkillCatalogItem[]> {
  if (!skillCatalogPromise) {
    skillCatalogPromise = (async () => {
      const url = getApiUrl("/api/v1/qna/tags/");

      const response = await fetch(url, {
        method: "GET",
        credentials: AUTH_REQUEST_CREDENTIALS,
      });

      const data = await parseJsonSafe(response);

      if (!response.ok) {
        throw createApiRequestError(
          "Failed to load skill catalog",
          response.status,
          data,
        );
      }

      const rawItems = Array.isArray(data)
        ? data
        : Array.isArray((data as { results?: unknown })?.results)
          ? (data as { results: unknown[] }).results
          : [];

      return rawItems
        .map((item) => {
          if (typeof item !== "object" || item === null) {
            return null;
          }

          const id = "id" in item ? (item as { id?: unknown }).id : undefined;
          const name = "name" in item ? (item as { name?: unknown }).name : undefined;

          if (typeof id !== "string" || typeof name !== "string") {
            return null;
          }

          return { id, name };
        })
        .filter((item): item is SkillCatalogItem => Boolean(item));
    })().catch((error) => {
      skillCatalogPromise = null;
      throw error;
    });
  }

  return skillCatalogPromise;
}
