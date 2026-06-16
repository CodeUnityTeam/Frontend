import { isAxiosError } from "axios";

export class ApiError extends Error {
  readonly status?: number;
  readonly data?: unknown;

  constructor(message: string, status?: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

const FALLBACK_MESSAGE = "Не удалось выполнить запрос. Попробуйте позже.";

const STATUS_MESSAGES: Record<number, string> = {
  400: "Проверьте правильность введённых данных",
  401: "Требуется авторизация",
  403: "Недостаточно прав для этого действия",
  500: "Ошибка сервера. Попробуйте позже.",
};

function extractBackendMessage(data: unknown): string | null {
  if (typeof data !== "object" || data === null) return null;

  for (const value of Object.values(data)) {
    if (typeof value === "string") return value;
    if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  }

  return null;
}

export function toApiError(error: unknown): ApiError {
  if (!isAxiosError(error)) return new ApiError(FALLBACK_MESSAGE);

  const status = error.response?.status;
  const data = error.response?.data;

  const backendMessage =
    status && status < 500 ? extractBackendMessage(data) : null;

  return new ApiError(
    backendMessage ??
      (status ? STATUS_MESSAGES[status] : null) ??
      FALLBACK_MESSAGE,
    status,
    data,
  );
}
