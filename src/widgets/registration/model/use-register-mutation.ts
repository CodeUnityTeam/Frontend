import { useMutation } from "@tanstack/react-query";
import {
  registerUser,
  type ApiRequestError,
  type RegistrationRequest,
  type RegistrationResponse,
} from "@/shared/api/auth";

export const useRegisterMutation = () => {
  return useMutation<RegistrationResponse, ApiRequestError, RegistrationRequest>({
    mutationFn: registerUser,
  });
};

export default useRegisterMutation;
