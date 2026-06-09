export type RegistrationRequest = {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
};

async function parseJsonSafe(response: Response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
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
    // Throw a structured error that includes status and parsed body
    const err: any = new Error("Registration failed");
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export async function getProviderUrl(provider: string) {
  const base = import.meta.env.VITE_API_URL as string;
  const url = `${base.replace(/\/$/, "")}/api/v1/user/auth/${provider}/url/`;

  const res = await fetch(url, { method: "GET", credentials: "include" });
  if (!res.ok) {
    const data = await parseJsonSafe(res).catch(() => null);
    const err: any = new Error("Failed to fetch provider url");
    err.status = res.status;
    err.data = data;
    throw err;
  }

  const data = await res.json();
  // backend may return different shapes: { url }, { authorization_url }, { auth_url }
  return (data && (data.url || data.authorization_url || data.auth_url)) || null;
}

export default {
  registerUser,
  getProviderUrl,
};
