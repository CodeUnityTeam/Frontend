import axios from "axios";

import { apiClient } from "@/shared/api";
import {
  mapUserDetails,
  type AuthSession,
  type LoginCredentials,
  type LoginResponseDto,
} from "../model/types";

export const INVALID_CREDENTIALS_MESSAGE = "Неверный E-mail или пароль";

const GENERIC_ERROR_MESSAGE = "Не удалось войти. Попробуйте позже.";

const MOCK_CREDENTIALS = {
  email: "test@kodyuniti.ru",
  password: "password123",
};

function mockLogin(credentials: LoginCredentials): Promise<AuthSession> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const isValid =
        credentials.email.trim().toLowerCase() === MOCK_CREDENTIALS.email &&
        credentials.password === MOCK_CREDENTIALS.password;

      if (!isValid) {
        reject(new Error(INVALID_CREDENTIALS_MESSAGE));
        return;
      }

      resolve({
        access: "mock-access-token",
        refresh: "mock-refresh-token",
        user: { id: "1", name: "Анна Иванова", email: credentials.email },
      });
    }, 600);
  });
}

function extractDrfError(data: unknown): string | null {
  if (typeof data !== "object" || data === null) return null;

  for (const value of Object.values(data)) {
    if (Array.isArray(value) && typeof value[0] === "string") return value[0];
    if (typeof value === "string") return value;
  }
  return null;
}

export async function login(
  credentials: LoginCredentials,
): Promise<AuthSession> {
  if (!import.meta.env.VITE_API_URL) {
    return mockLogin(credentials);
  }

  try {
    const { data } = await apiClient.post<LoginResponseDto>(
      "/user/auth/login/",
      credentials,
    );
    return {
      access: data.access,
      refresh: data.refresh,
      user: mapUserDetails(data.user),
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 401) {
        throw new Error(INVALID_CREDENTIALS_MESSAGE);
      }
      if (status === 400) {
        throw new Error(
          extractDrfError(error.response?.data) ?? INVALID_CREDENTIALS_MESSAGE,
        );
      }
    }
    throw new Error(GENERIC_ERROR_MESSAGE);
  }
}
