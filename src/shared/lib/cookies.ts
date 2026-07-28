export function setCookie(name: string, value: string, days: number = 1): void {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

export function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function deleteCookie(name: string): void {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

export const OAUTH_STATE_KEY = "oauth_state";
export const OAUTH_PROVIDER_KEY = "oauth_provider";

export function saveOAuthState(state: string, provider: string): void {
  setCookie(OAUTH_STATE_KEY, state, 1);
  setCookie(OAUTH_PROVIDER_KEY, provider, 1);
}

export function getOAuthState(): string | null {
  return getCookie(OAUTH_STATE_KEY);
}

export function getOAuthProvider(): string | null {
  return getCookie(OAUTH_PROVIDER_KEY);
}

export function clearOAuthState(): void {
  deleteCookie(OAUTH_STATE_KEY);
  deleteCookie(OAUTH_PROVIDER_KEY);
}