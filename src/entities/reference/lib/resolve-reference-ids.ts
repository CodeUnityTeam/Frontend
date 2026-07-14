import type { ReferenceItem } from "@/entities/reference/model/types";

export interface ResolvedReferenceIds {
  ids: string[];
  unknown: string[];
}

function normalizeLookupKey(value: string): string {
  return value.trim().toLowerCase().replaceAll("ё", "е");
}

export function resolveReferenceIds(
  names: string[],
  catalog: ReferenceItem[],
): ResolvedReferenceIds {
  const idByName = new Map(
    catalog.map((item) => [normalizeLookupKey(item.name), item.id]),
  );

  const ids: string[] = [];
  const unknown: string[] = [];

  for (const name of names) {
    const id = idByName.get(normalizeLookupKey(name));
    if (!id) {
      unknown.push(name);
    } else if (!ids.includes(id)) {
      ids.push(id);
    }
  }

  return { ids, unknown };
}
