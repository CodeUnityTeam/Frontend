import { useQuery } from "@tanstack/react-query";
import { fetchSkillCatalog } from "@/shared/api/skills";
import type { Skill } from "../model/types";

export function useSkills() {
  return useQuery({
    queryKey: ["qna-skills-catalog"],
    queryFn: async (): Promise<Skill[]> => {
      const data = await fetchSkillCatalog();

      return data.map((item) => ({
        skillId: item.id,
        name: item.name,
      }));
    },
    staleTime: Infinity,
  });
}
