import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ clearTokens: vi.fn() }));

vi.mock("@/shared/lib/auth", () => ({ clearTokens: mocks.clearTokens }));

import { ROUTES } from "@/shared/model/routes";
import { handleHttpError } from "./handle-http-error";

describe("handleHttpError", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("clears tokens and opens the login modal for unauthorized Axios errors", () => {
    // Init
    const navigate = vi.fn();
    const openLoginModal = vi.fn();
    const error = { isAxiosError: true, response: { status: 401 } };

    // Action
    const handled = handleHttpError(error, { navigate, openLoginModal });

    // Assert
    expect(handled).toBe(true);
    expect(mocks.clearTokens).toHaveBeenCalledOnce();
    expect(openLoginModal).toHaveBeenCalledOnce();
    expect(navigate).not.toHaveBeenCalled();
  });

  it("redirects unauthorized errors to login when no modal callback is provided", () => {
    // Init
    const navigate = vi.fn();
    const error = { isAxiosError: true, response: { status: 401 } };

    // Action
    const handled = handleHttpError(error, { navigate });

    // Assert
    expect(handled).toBe(true);
    expect(mocks.clearTokens).toHaveBeenCalledOnce();
    expect(navigate).toHaveBeenCalledWith(ROUTES.LOGIN, { replace: true });
  });

  it.each([
    [403, ROUTES.FORBIDDEN],
    [500, ROUTES.SERVER_ERROR],
  ])("redirects Axios status %i to its dedicated error route", (status, route) => {
    // Init
    const navigate = vi.fn();
    const error = { isAxiosError: true, response: { status } };

    // Action
    const handled = handleHttpError(error, { navigate });

    // Assert
    expect(handled).toBe(true);
    expect(navigate).toHaveBeenCalledWith(route, { replace: true });
    expect(mocks.clearTokens).not.toHaveBeenCalled();
  });

  it("leaves non-Axios and unsupported status errors untouched", () => {
    // Init
    const navigate = vi.fn();

    // Action
    const networkHandled = handleHttpError(new Error("offline"), { navigate });
    const validationHandled = handleHttpError(
      { isAxiosError: true, response: { status: 400 } },
      { navigate },
    );

    // Assert
    expect(networkHandled).toBe(false);
    expect(validationHandled).toBe(false);
    expect(mocks.clearTokens).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });
});
