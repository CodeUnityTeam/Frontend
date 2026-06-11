import { useMutation } from "@tanstack/react-query";

import { setTokens } from "@/shared/lib/auth";
import { login } from "./login";
import type { AuthSession, LoginCredentials } from "../model/types";

export function useLogin() {
  return useMutation<AuthSession, Error, LoginCredentials>({
    mutationFn: login,
    onSuccess: (data) => {
      setTokens({ access: data.access, refresh: data.refresh });
    },
  });
}
