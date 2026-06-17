import { apiClient } from "@/shared/api";

import type { ReferenceItem } from "@/entities/reference/model/types";

type ReferenceType = "format" | "spec";

type ReferenceDto = { name: string } & Record<string, string>;

export async function getReference(
  type: ReferenceType,
): Promise<ReferenceItem[]> {
  const { data } = await apiClient.get<ReferenceDto[]>(`/help/${type}/`);
  return data.map((dto) => ({ id: dto[`${type}_id`], name: dto.name }));
}
