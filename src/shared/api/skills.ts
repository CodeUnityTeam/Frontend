import { apiClient } from "./index";

export type SkillCatalogItem = {
  id: string;
  name: string;
};

let skillCatalogPromise: Promise<SkillCatalogItem[]> | null = null;

export async function fetchSkillCatalog(): Promise<SkillCatalogItem[]> {
  if (!skillCatalogPromise) {
    skillCatalogPromise = (async () => {
      const { data } = await apiClient.get<unknown>("/qna/tags/");

      const rawItems: Record<string, unknown>[] = Array.isArray(data)
        ? data
        : Array.isArray((data as { results?: unknown })?.results)
          ? (data as { results: unknown[] }).results
          : [];

      return rawItems
        .map((item) => {
          if (typeof item !== "object" || item === null) {
            return null;
          }

          const id = item.skill_id ?? item.id;
          const name = item.name;

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
