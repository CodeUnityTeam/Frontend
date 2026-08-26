import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const requestUse = vi.fn();
  const responseUse = vi.fn();
  const client = Object.assign(vi.fn(), {
    interceptors: {
      request: { use: requestUse },
      response: { use: responseUse },
    },
    post: vi.fn(),
  });

  class AxiosErrorMock extends Error {
    config?: Record<string, unknown>;
    response?: { status?: number };

    constructor(
      message = "Request failed",
      config?: Record<string, unknown>,
      response?: { status?: number },
    ) {
      super(message);
      this.config = config;
      this.response = response;
    }
  }

  return {
    AxiosErrorMock,
    client,
    getAccessToken: vi.fn(),
    getRefreshToken: vi.fn(),
    logout: vi.fn(),
    setTokens: vi.fn(),
    toApiError: vi.fn((error: unknown) => ({ mapped: error })),
    requestUse,
    responseUse,
  };
});

vi.mock("axios", () => ({
  default: { create: vi.fn(() => mocks.client) },
  AxiosError: mocks.AxiosErrorMock,
}));
vi.mock("@/shared/lib/auth", () => ({
  getAccessToken: mocks.getAccessToken,
  getRefreshToken: mocks.getRefreshToken,
  setTokens: mocks.setTokens,
}));
vi.mock("./api-error", () => ({ toApiError: mocks.toApiError }));
vi.mock("./auth", () => ({ logout: mocks.logout }));

import { apiClient } from "./api-client";

function getHandlers() {
  return {
    onRequest: mocks.requestUse.mock.calls[0]?.[0] as (config: {
      headers: Record<string, string>;
    }) => unknown,
    onResponseError: mocks.responseUse.mock.calls[0]?.[1] as (
      error: unknown,
    ) => Promise<unknown>,
  };
}

const interceptors = getHandlers();

function createAxiosError(
  status: number,
  config: Record<string, unknown> = { url: "/projects/1/", headers: {} },
) {
  return new mocks.AxiosErrorMock("Unauthorized", config, { status });
}

describe("apiClient interceptors", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("adds the access token only when one is available", () => {
    // Init
    const { onRequest } = interceptors;
    const authenticatedConfig = { headers: {} as Record<string, string> };
    const anonymousConfig = { headers: {} as Record<string, string> };
    mocks.getAccessToken.mockReturnValueOnce("access-token").mockReturnValueOnce(null);

    // Action
    const authenticatedResult = onRequest(authenticatedConfig);
    const anonymousResult = onRequest(anonymousConfig);

    // Assert
    expect(apiClient).toBe(mocks.client);
    expect(authenticatedResult).toBe(authenticatedConfig);
    expect(authenticatedConfig.headers.Authorization).toBe("Bearer access-token");
    expect(anonymousResult).toBe(anonymousConfig);
    expect(anonymousConfig.headers.Authorization).toBeUndefined();
  });

  it("rethrows non-Axios errors without mapping them", async () => {
    // Init
    const { onResponseError } = interceptors;
    const error = new Error("offline");

    // Action
    const result = onResponseError(error);

    // Assert
    await expect(result).rejects.toBe(error);
    expect(mocks.toApiError).not.toHaveBeenCalled();
  });

  it("maps ineligible unauthorized responses without attempting a refresh", async () => {
    // Init
    const { onResponseError } = interceptors;
    const error = createAxiosError(401, {
      url: "/auth/login/",
      headers: {},
    });

    // Action
    const result = onResponseError(error);

    // Assert
    await expect(result).rejects.toEqual({ mapped: error });
    expect(mocks.getRefreshToken).not.toHaveBeenCalled();
    expect(mocks.client.post).not.toHaveBeenCalled();
  });

  it("logs out and maps an unauthorized response when no refresh token exists", async () => {
    // Init
    const { onResponseError } = interceptors;
    const error = createAxiosError(401);
    mocks.getRefreshToken.mockReturnValue(null);

    // Action
    const result = onResponseError(error);

    // Assert
    await expect(result).rejects.toEqual({ mapped: error });
    expect(mocks.logout).toHaveBeenCalledOnce();
    expect(mocks.client.post).not.toHaveBeenCalled();
  });

  it("refreshes tokens and retries the original request", async () => {
    // Init
    const { onResponseError } = interceptors;
    const originalRequest = { url: "/projects/1/", headers: {} as Record<string, string> };
    const error = createAxiosError(401, originalRequest);
    mocks.getRefreshToken.mockReturnValue("refresh-token");
    mocks.client.post.mockResolvedValue({ data: { access: "new-access" } });
    mocks.client.mockResolvedValue({ data: "retried" });

    // Action
    const result = await onResponseError(error);

    // Assert
    expect(mocks.client.post).toHaveBeenCalledWith("/auth/token/refresh/", {
      refresh: "refresh-token",
    });
    expect(mocks.setTokens).toHaveBeenCalledWith({
      access: "new-access",
      refresh: "refresh-token",
    });
    expect(originalRequest).toMatchObject({
      _retry: true,
      headers: { Authorization: "Bearer new-access" },
    });
    expect(mocks.client).toHaveBeenCalledWith(originalRequest);
    expect(result).toEqual({ data: "retried" });
  });

  it("rejects queued requests, logs out, and maps refresh failures", async () => {
    // Init
    const { onResponseError } = interceptors;
    const refreshError = createAxiosError(500);
    const firstError = createAxiosError(401, { url: "/projects/1/", headers: {} });
    const queuedError = createAxiosError(401, { url: "/projects/2/", headers: {} });
    mocks.getRefreshToken.mockReturnValue("refresh-token");
    mocks.client.post.mockRejectedValue(refreshError);

    // Action
    const firstResult = onResponseError(firstError);
    const queuedResult = onResponseError(queuedError);

    // Assert
    await expect(firstResult).rejects.toEqual({ mapped: refreshError });
    await expect(queuedResult).rejects.toBe(refreshError);
    expect(mocks.logout).toHaveBeenCalledOnce();
    expect(mocks.toApiError).toHaveBeenCalledWith(refreshError);
  });
});
