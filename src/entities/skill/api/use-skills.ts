import { useQuery } from "@tanstack/react-query";

import { getSkills } from "@/entities/skill/api/get-skills";

export function useSkills() {
  return useQuery({
    queryKey: ["skills"],
    queryFn: getSkills,
    staleTime: Infinity,
  });
}
