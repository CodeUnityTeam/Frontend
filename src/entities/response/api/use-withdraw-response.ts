import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/api";
import { RESPONSES_QUERY_KEY } from "@/entities/response";

type WithdrawResponseParams = {
  responseId: string;
};

export const useWithdrawResponse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ responseId }: WithdrawResponseParams) => {
      const response = await apiClient.patch(
        `/projects/responses/${responseId}/status/`,
        { status: "withdrawn" }
      );
      return response.data;
    },
    onSuccess: () => {
      // Инвалидируем ленту откликов после отзыва
      queryClient.invalidateQueries({ queryKey: [RESPONSES_QUERY_KEY] });
    },
  });
};