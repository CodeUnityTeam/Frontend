import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/api";
import { toast } from "sonner";
import type { ResponseStatus } from "../model/types";
import { RESPONSES_QUERY_KEY } from "./use-responses";
import { PEOPLE_RESPONSES_QUERY_KEY } from "@/entities/profile";

type UpdateResponseStatusParams = {
  responseId: string;
  status: ResponseStatus;
};

export function useUpdateResponseStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      responseId,
      status,
    }: UpdateResponseStatusParams) => {
      const { data } = await apiClient.patch(
        `/projects/responses/${responseId}/status/`,
        { status },
      );

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [RESPONSES_QUERY_KEY],
      });

      queryClient.invalidateQueries({
        queryKey: [PEOPLE_RESPONSES_QUERY_KEY],
      });

      toast.success("Статус отклика обновлен");
    },
  });
}