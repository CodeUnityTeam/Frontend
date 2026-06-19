import { useQuery } from "@tanstack/react-query";

import { getReference } from "@/entities/reference/api/get-reference";

export function useSpecializations() {
  return useQuery({
    queryKey: ["reference", "spec"],
    queryFn: () => getReference("spec"),
    staleTime: Infinity,
  });
}
