const ACCESS_KEY = "ku_access";
const REFRESH_KEY = "ku_refresh";

export interface TokenPair {
  access: string;
  refresh: string;
}

export function getAccessToken(): string | null {
  try {
    return localStorage.getItem(ACCESS_KEY);
  } catch {
    return null;
  }
}

export function getRefreshToken(): string | null {
  try {
    return localStorage.getItem(REFRESH_KEY);
  } catch {
    return null;
  }
}

export function setTokens({ access, refresh }: TokenPair): void {
  try {
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  } catch {
    // localStorage может быть недоступен (приватный режим) — молча игнорируем.
  }
}

export function setAccessToken(access: string): void {
  try {
    localStorage.setItem(ACCESS_KEY, access);
  } catch {
    // см. setTokens
  }
}

export function clearTokens(): void {
  try {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  } catch {
    // см. setTokens
  }
}
