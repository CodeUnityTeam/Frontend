export const EMAIL_VERIFICATION_LOADING_MESSAGE =
  "Подтверждаем email, пожалуйста подождите.";

export const EMAIL_VERIFICATION_EXPIRED_MESSAGE =
  "Ссылка подтверждения устарела или уже использована. Необходимо пройти регистрацию заново, чтобы получить новый ключ подтверждения";

function extractBackendMessage(data: unknown): string | null {
  if (typeof data !== "object" || data === null) {
    return null;
  }

  if ("detail" in data) {
    const detail = (data as { detail?: unknown }).detail;
    if (typeof detail === "string" && detail.trim()) {
      return detail;
    }
  }

  for (const value of Object.values(data)) {
    if (typeof value === "string" && value.trim()) {
      return value;
    }

    if (Array.isArray(value)) {
      const firstMessage = value.find(
        (item): item is string => typeof item === "string" && item.trim().length > 0,
      );
      if (typeof firstMessage === "string") {
        return firstMessage;
      }
    }
  }

  return null;
}

export function getEmailVerificationMessageFromData(
  data: unknown,
  fallback: string,
): string {
  return extractBackendMessage(data) ?? fallback;
}
