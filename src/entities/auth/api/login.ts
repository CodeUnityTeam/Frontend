import { apiClient } from "@/shared/api";
import {
  mapUserDetails,
  type AuthSession,
  type LoginCredentials,
  type LoginResponseDto,
} from "@/entities/auth/model/types";

export async function login(
  credentials: LoginCredentials,
): Promise<AuthSession> {
  const { data } = await apiClient.post<LoginResponseDto>(
    "/user/auth/login/",
    credentials,
  );

  return {
    access: data.access,
    refresh: data.refresh,
    user: mapUserDetails(data.user),
  };
}
