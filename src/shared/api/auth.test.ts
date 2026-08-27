import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  apiClient: { get: vi.fn(), post: vi.fn() },
  clearTokens: vi.fn(),
  getRefreshToken: vi.fn(),
  setTokens: vi.fn(),
}));

vi.mock("@/shared/api", () => ({ apiClient: mocks.apiClient }));
vi.mock("@/shared/lib/auth", () => ({
  clearTokens: mocks.clearTokens,
  getRefreshToken: mocks.getRefreshToken,
  setTokens: mocks.setTokens,
}));

import {
  getMailRuAuthUrl,
  getProviderUrl,
  getYandexAuthUrl,
  logout,
  refreshToken,
  registerUser,
  verifyEmail,
} from "./auth";

describe("auth API", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("forwards registration and email verification payloads and returns response bodies", async () => {
    // Init
    const registration = { email: "ada@example.com", first_name: "Ada", last_name: "Lovelace", password: "secret" };
    mocks.apiClient.post.mockResolvedValueOnce({ data: { detail: "Check email" } }).mockResolvedValueOnce({ data: { verified: true } });

    // Action
    const result = await registerUser(registration);
    const verification = await verifyEmail({ key: "verification-key" });

    // Assert
    expect(result).toEqual({ detail: "Check email" });
    expect(verification).toEqual({ verified: true });
    expect(mocks.apiClient.post).toHaveBeenNthCalledWith(1, "/user/auth/registration/", registration);
    expect(mocks.apiClient.post).toHaveBeenNthCalledWith(2, "/user/auth/registration/verify-email/", { key: "verification-key" });
  });

  it("uses provider-specific URL endpoints and safely handles a missing optional URL", async () => {
    // Init
    mocks.apiClient.get.mockResolvedValueOnce({ data: {} }).mockResolvedValueOnce({ data: { authorization_url: "https://yandex.example" } }).mockResolvedValueOnce({ data: { authorization_url: "https://mailru.example" } });

    // Action
    const genericUrl = await getProviderUrl("custom-provider");
    const yandexUrl = await getYandexAuthUrl();
    const mailRuUrl = await getMailRuAuthUrl();

    // Assert
    expect(genericUrl).toBeNull();
    expect(yandexUrl).toBe("https://yandex.example");
    expect(mailRuUrl).toBe("https://mailru.example");
    expect(mocks.apiClient.get).toHaveBeenNthCalledWith(1, "/user/auth/custom-provider/url/");
    expect(mocks.apiClient.get).toHaveBeenNthCalledWith(2, "/user/auth/yandex/url/");
    expect(mocks.apiClient.get).toHaveBeenNthCalledWith(3, "/user/auth/mailru/url/");
  });

  it("clears local credentials even when remote logout fails", async () => {
    // Init
    mocks.getRefreshToken.mockReturnValue("refresh-token");
    mocks.apiClient.post.mockRejectedValue(new Error("offline"));

    // Action
    await expect(logout()).rejects.toThrow("offline");

    // Assert
    expect(mocks.apiClient.post).toHaveBeenCalledWith("/auth/logout/", { refresh: "refresh-token" });
    expect(mocks.clearTokens).toHaveBeenCalledOnce();
  });

  it("does not attempt a refresh request without a refresh token", async () => {
    // Init
    mocks.getRefreshToken.mockReturnValue(null);

    // Action
    const request = refreshToken();

    // Assert
    await expect(request).rejects.toThrow("No refresh token available");
    expect(mocks.apiClient.post).not.toHaveBeenCalled();
    expect(mocks.setTokens).not.toHaveBeenCalled();
  });

  it("keeps the current refresh token when the refresh endpoint only rotates access", async () => {
    // Init
    mocks.getRefreshToken.mockReturnValue("refresh-token");
    mocks.apiClient.post.mockResolvedValue({ data: { access: "new-access" } });

    // Action
    const result = await refreshToken();

    // Assert
    expect(result).toEqual({ access: "new-access" });
    expect(mocks.apiClient.post).toHaveBeenCalledWith("/user/auth/token/refresh/", { refresh: "refresh-token" });
    expect(mocks.setTokens).not.toHaveBeenCalled();
  });
});
