import { apiClient } from "@/shared/api";

import type { Skill } from "@/entities/skill/model/types";

interface SkillDto {
  skill_id: string;
  name: string;
}

export async function getSkills(): Promise<Skill[]> {
  const { data } = await apiClient.get<SkillDto[]>("/qna/tags/");
  return data.map((dto) => ({ skillId: dto.skill_id, name: dto.name }));
}
