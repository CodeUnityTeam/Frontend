export type RegistrationRequest = {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
};

export type ApiRequestError = Error & {
  status?: number;
  data?: unknown;
};

async function parseJsonSafe(response: Response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}

function createApiRequestError(
  message: string,
  status?: number,
  data?: unknown,
): ApiRequestError {
  const error = new Error(message) as ApiRequestError;
  error.status = status;
  error.data = data;
  return error;
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
    credentials: "include",
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) {
    throw createApiRequestError("Registration failed", res.status, data);
  }

  return data;
}

export async function getProviderUrl(provider: string) {
  const base = import.meta.env.VITE_API_URL as string;
  const url = `${base.replace(/\/$/, "")}/api/v1/user/auth/${provider}/url/`;

  const res = await fetch(url, { method: "GET", credentials: "include" });
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
  getProviderUrl,
};
