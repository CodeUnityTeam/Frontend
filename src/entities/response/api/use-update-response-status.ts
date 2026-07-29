import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/api";
import { RESPONSES_QUERY_KEY } from "@/entities/response";

export function useUpdateResponseStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      responseId,
      status,
    }: {
      responseId: string;
      status: "approved" | "rejected";
    }) =>
      apiClient.patch(`/projects/responses/${responseId}/status/`, {
        status,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [RESPONSES_QUERY_KEY],
      });
    },
  });
}