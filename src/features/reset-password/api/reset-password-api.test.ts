import { describe, expect, it, vi } from "vitest";

import { apiClient } from "@/shared/api";
import { resetPasswordApi, resetPasswordConfirmApi } from "./reset-password-api";

vi.mock("@/shared/api", () => ({ apiClient: { post: vi.fn() } }));

describe("reset password API", () => {
  it("requests a reset link for the submitted email", async () => {
    vi.mocked(apiClient.post).mockResolvedValueOnce({});

    await expect(resetPasswordApi("user@example.com")).resolves.toBeUndefined();
    expect(apiClient.post).toHaveBeenCalledWith("/user/auth/password/reset/", { email: "user@example.com" });
  });

  it("posts the uid, token, and new password confirmation payload", async () => {
    const payload = { uid: "uid", token: "token", new_password: "password1" };
    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: { detail: "Пароль изменен" } });

    await expect(resetPasswordConfirmApi(payload)).resolves.toEqual({ detail: "Пароль изменен" });
    expect(apiClient.post).toHaveBeenCalledWith("/user/auth/password/reset/confirm/", payload);
  });
});
