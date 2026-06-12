import { useMutation } from "@tanstack/react-query";
import {
  registerUser,
  type ApiRequestError,
  type RegistrationRequest,
} from "@/shared/api/auth";

export const useRegisterMutation = () => {
  return useMutation<unknown, ApiRequestError, RegistrationRequest>({
    mutationFn: registerUser,
  });
};

export default useRegisterMutation;
