import { useMutation } from "@tanstack/react-query";
import { refreshToken } from "@/shared/api/auth";
import { setAccessToken } from "@/shared/lib/auth";

export function useRefresh() {
  return useMutation({
    mutationFn: refreshToken,
    onSuccess: (data) => {
      setAccessToken(data.access);
    },
  });
}