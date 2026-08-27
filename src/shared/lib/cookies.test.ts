import { afterEach, describe, expect, it, vi } from "vitest";

import {
  OAUTH_PROVIDER_KEY,
  OAUTH_STATE_KEY,
  clearOAuthState,
  deleteCookie,
  getCookie,
  getOAuthProvider,
  getOAuthState,
  saveOAuthState,
  setCookie,
} from "./cookies";

function clearCookies() {
  document.cookie.split(";").forEach((cookie) => {
    document.cookie = `${cookie.trim().split("=")[0]}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  });
}

describe("cookie helpers", () => {
  afterEach(() => {
    clearCookies();
    vi.useRealTimers();
  });

  it("stores values at the application path with a Lax same-site policy", () => {
    // Init
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-01T00:00:00Z"));
    const cookieSetter = vi.spyOn(Document.prototype, "cookie", "set");

    // Action
    setCookie("session_hint", "value", 2);

    // Assert
    expect(getCookie("session_hint")).toBe("value");
    expect(cookieSetter).toHaveBeenCalledWith(expect.stringContaining("path=/;SameSite=Lax"));
    expect(cookieSetter).toHaveBeenCalledWith(expect.stringContaining("expires=Fri, 03 Jan 2025 00:00:00 GMT"));
  });

  it("reads names without confusing them with a prefix and deletes the target cookie", () => {
    // Init
    setCookie("oauth", "incorrect");
    setCookie("oauth_state", "expected");

    // Action
    const value = getCookie("oauth_state");
    deleteCookie("oauth_state");

    // Assert
    expect(value).toBe("expected");
    expect(getCookie("oauth_state")).toBeNull();
    expect(getCookie("oauth")).toBe("incorrect");
  });

  it("persists and clears both OAuth values together", () => {
    // Init
    const state = "csrf-nonce";
    const provider = "yandex";

    // Action
    saveOAuthState(state, provider);
    const stored = [getOAuthState(), getOAuthProvider()];
    clearOAuthState();

    // Assert
    expect(OAUTH_STATE_KEY).toBe("oauth_state");
    expect(OAUTH_PROVIDER_KEY).toBe("oauth_provider");
    expect(stored).toEqual([state, provider]);
    expect(getOAuthState()).toBeNull();
    expect(getOAuthProvider()).toBeNull();
  });
});
