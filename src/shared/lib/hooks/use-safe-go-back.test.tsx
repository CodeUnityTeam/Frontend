import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const navigate = vi.hoisted(() => vi.fn());

vi.mock("react-router", () => ({ useNavigate: () => navigate }));

import { useSafeGoBack } from "./use-safe-go-back";

describe("useSafeGoBack", () => {
  afterEach(() => {
    navigate.mockReset();
    window.history.replaceState(null, "", "/");
  });

  it("navigates backward when router history has a previous entry", () => {
    // Init
    window.history.replaceState({ idx: 2 }, "", "/details");
    const { result } = renderHook(() => useSafeGoBack({ fallbackTo: "/projects" }));

    // Action
    act(() => result.current());

    // Assert
    expect(navigate).toHaveBeenCalledWith(-1);
  });

  it("uses a replace fallback when no safe history entry exists", () => {
    // Init
    window.history.replaceState({ idx: 0 }, "", "/details");
    const { result } = renderHook(() => useSafeGoBack({ fallbackTo: "/projects" }));

    // Action
    act(() => result.current());

    // Assert
    expect(navigate).toHaveBeenCalledWith("/projects", { replace: true });
  });

  it("allows callers to preserve the fallback history entry", () => {
    // Init
    window.history.replaceState(null, "", "/details");
    const { result } = renderHook(() => useSafeGoBack({ fallbackTo: "/projects", replaceFallback: false }));

    // Action
    act(() => result.current());

    // Assert
    expect(navigate).toHaveBeenCalledWith("/projects", { replace: false });
  });
});
