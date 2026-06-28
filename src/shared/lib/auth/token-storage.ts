const ACCESS_KEY = "ku_access";
const REFRESH_KEY = "ku_refresh";
const AUTH_CHANGED_EVENT = "ku:auth-changed";

export interface TokenPair {
  access: string;
  refresh: string;
}

function notifyAuthChanged(): void {
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function subscribeAuthChanged(listener: () => void): () => void {
  window.addEventListener(AUTH_CHANGED_EVENT, listener);
  // событие storage прилетает из других вкладок (логаут/логин там)
  window.addEventListener("storage", listener);

  return () => {
    window.removeEventListener(AUTH_CHANGED_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
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
    // localStorage может быть недоступен (приватный режим)
  }

  notifyAuthChanged();
}

export function setAccessToken(access: string): void {
  try {
    localStorage.setItem(ACCESS_KEY, access);
  } catch {
    // localStorage недоступен (приватный режим)
  }

  notifyAuthChanged();
}

export function clearTokens(): void {
  try {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  } catch {
    // localStorage недоступен (приватный режим)
  }
  notifyAuthChanged();
}
