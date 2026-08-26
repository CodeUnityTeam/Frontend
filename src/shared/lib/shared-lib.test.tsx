import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { clearTokens, getAccessToken, getRefreshToken, setAccessToken, setTokens } from "./auth";
import { subscribeAuthChanged } from "./auth/token-storage";
import { clearOAuthState, getCookie, getOAuthProvider, getOAuthState, saveOAuthState } from "./cookies";
import { formatDate } from "./format-date";
import { formatLastSeen } from "./format-last-seen";
import { formatRelativeDate } from "./pluralize";
import { useIsAuthed } from "./auth/use-is-authed";
import { useModal } from "./hooks/use-modal";
import { useProjectStatus } from "./hooks/use-project-status";
import { cn } from "./utils";

afterEach(() => {
  localStorage.clear();
  document.cookie.split(";").forEach((cookie) => {
    document.cookie = `${cookie.trim().split("=")[0]}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  });
  vi.useRealTimers();
});

describe("shared library helpers", () => {
  it("stores tokens, notifies subscribers, and removes both values", () => {
    // Init
    const listener = vi.fn();
    const unsubscribe = subscribeAuthChanged(listener);

    // Action
    setTokens({ access: "access", refresh: "refresh" });
    setAccessToken("next-access");
    clearTokens();
    unsubscribe();

    // Assert
    expect(getAccessToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
    expect(listener).toHaveBeenCalledTimes(3);
  });

  it("reactively reports whether an access token exists", () => {
    // Init
    const { result } = renderHook(() => useIsAuthed());

    // Action
    act(() => setAccessToken("access"));

    // Assert
    expect(result.current).toBe(true);
  });

  it("persists and clears OAuth cookie state", () => {
    // Init
    saveOAuthState("nonce", "yandex");

    // Action
    const saved = [getOAuthState(), getOAuthProvider(), getCookie("missing")];
    clearOAuthState();

    // Assert
    expect(saved).toEqual(["nonce", "yandex", null]);
    expect(getOAuthState()).toBeNull();
    expect(getOAuthProvider()).toBeNull();
  });

  it("formats valid and invalid dates without leaking timezone-sensitive state", () => {
    // Init
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-05-10T12:00:00Z"));

    // Action
    const values = [formatDate("2025-01-02T00:00:00Z"), formatDate("invalid"), formatLastSeen("2025-05-10T01:00:00Z"), formatLastSeen("2025-05-09T01:00:00Z")];

    // Assert
    expect(values).toEqual(["02.01.2025", "", "сегодня", "вчера"]);
  });

  it("uses Russian relative-date grammar and merges Tailwind conflicts", () => {
    // Init
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-05-20T12:00:00Z"));

    // Action
    const values = [formatRelativeDate("2025-05-19T12:00:00Z"), formatRelativeDate("2025-05-18T12:00:00Z"), formatRelativeDate("2025-05-09T12:00:00Z"), cn("px-2 text-red-500", false, "px-4")];

    // Assert
    expect(values).toEqual(["1 день назад", "2 дня назад", "11 дней назад", "text-red-500 px-4"]);
  });

  it("controls modal state and chooses project filters deterministically", () => {
    // Init
    const { result } = renderHook(() => useModal());

    // Action
    act(() => {
      result.current.openModal();
      result.current.toggleModal();
      result.current.setOpen(true);
    });

    // Assert
    expect(result.current.open).toBe(true);
    expect(useProjectStatus("my-projects", true)).toEqual(["draft", "published", "recruiting_closed"]);
    expect(useProjectStatus("favorites", false)).toEqual(["published", "recruiting_closed"]);
    expect(useProjectStatus("all", false)).toEqual(["published"]);
  });
});
