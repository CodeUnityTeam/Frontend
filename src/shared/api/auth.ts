export type RegistrationRequest = {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
};

export type VerifyEmailRequest = {
  key: string;
};

export type ApiRequestError = Error & {
  status?: number;
  data?: unknown;
};

const DEFAULT_AUTH_REQUEST_CREDENTIALS: RequestCredentials = "include";
const ACCESS_TOKEN_COOKIE_NAME = "access-token";

function resolveAuthRequestCredentials(): RequestCredentials {
  const mode = import.meta.env.VITE_AUTH_REQUEST_CREDENTIALS;

  if (mode === "include" || mode === "omit" || mode === "same-origin") {
    return mode;
  }

  return DEFAULT_AUTH_REQUEST_CREDENTIALS;
}

export const AUTH_REQUEST_CREDENTIALS = resolveAuthRequestCredentials();

export async function parseJsonSafe(response: Response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}

export function createApiRequestError(
  message: string,
  status?: number,
  data?: unknown,
): ApiRequestError {
  const error = new Error(message) as ApiRequestError;
  error.status = status;
  error.data = data;
  return error;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`));

  if (!cookie) {
    return null;
  }

  const value = cookie.slice(name.length + 1);
  return value ? decodeURIComponent(value) : null;
}

export function getAccessTokenFromCookie(): string | null {
  return getCookie(ACCESS_TOKEN_COOKIE_NAME);
}

export async function registerUser(payload: RegistrationRequest) {
  const base = import.meta.env.VITE_API_URL as string;
  const url = `${base.replace(/\/$/, "")}/api/v1/user/auth/registration/`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: AUTH_REQUEST_CREDENTIALS,
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) {
    throw createApiRequestError("Registration failed", res.status, data);
  }

  return data;
}

export async function verifyEmail(payload: VerifyEmailRequest) {
  const base = import.meta.env.VITE_API_URL as string;
  const url = `${base.replace(/\/$/, "")}/api/v1/user/auth/registration/verify-email/`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: AUTH_REQUEST_CREDENTIALS,
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) {
    throw createApiRequestError("Email verification failed", res.status, data);
  }

  return data;
}

export async function getProviderUrl(provider: string) {
  const base = import.meta.env.VITE_API_URL as string;
  const url = `${base.replace(/\/$/, "")}/api/v1/user/auth/${provider}/url/`;

  const res = await fetch(url, {
    method: "GET",
    credentials: AUTH_REQUEST_CREDENTIALS,
  });
  if (!res.ok) {
    const data = await parseJsonSafe(res).catch(() => null);
    throw createApiRequestError(
      "Failed to fetch provider url",
      res.status,
      data,
    );
  }

  const data = await res.json();
  // backend may return different shapes: { url }, { authorization_url }, { auth_url }
  return (
    (data && (data.url || data.authorization_url || data.auth_url)) || null
  );
}

export default {
  registerUser,
  verifyEmail,
  getProviderUrl,
};
