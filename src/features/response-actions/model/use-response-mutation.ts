import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/api";
import { toast } from "sonner";
import type { ResponseStatus } from "@/entities/response/model/types";

export function useUpdateResponseStatus(responseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: ResponseStatus) => {
      const { data } = await apiClient.patch<{ status: ResponseStatus }>(
        `/projects/responses/${responseId}/status/`,
        { status }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["responses"] });
      queryClient.invalidateQueries({ queryKey: ["project"] });
      toast.success("Статус отклика обновлен");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.detail || "Не удалось обновить статус отклика";
      toast.error(message);
    },
  });
}