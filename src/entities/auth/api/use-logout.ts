import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { logout } from "@/shared/api/auth";
import { ROUTES } from "@/shared/model/routes";

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      navigate(ROUTES.HOME);
    },
    onError: () => {
      queryClient.clear();
      navigate(ROUTES.HOME);
    },
  });
}