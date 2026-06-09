import { useMutation } from "@tanstack/react-query";
import { registerUser, type RegistrationRequest } from "@/shared/api/auth";

export const useRegisterMutation = () => {
  // explicitly type TVariables as RegistrationRequest so mutate accepts payload
  return useMutation<unknown, unknown, RegistrationRequest>((payload: RegistrationRequest) =>
    registerUser(payload),
  );
};

export default useRegisterMutation;
