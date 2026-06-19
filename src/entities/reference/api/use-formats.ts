import { useQuery } from "@tanstack/react-query";

import { getReference } from "@/entities/reference/api/get-reference";

export function useFormats() {
  return useQuery({
    queryKey: ["reference", "format"],
    queryFn: () => getReference("format"),
    staleTime: Infinity,
  });
}
