import { describe, expect, it, vi } from "vitest";

import { apiClient } from "@/shared/api";
import { changePasswordApi } from "./change-password-api";

vi.mock("@/shared/api", () => ({ apiClient: { post: vi.fn() } }));

describe("changePasswordApi", () => {
  it("posts the password payload and returns the server detail", async () => {
    const payload = { old_password: "current123", new_password: "new-password" };
    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: { detail: "Пароль изменен" } });

    await expect(changePasswordApi(payload)).resolves.toEqual({ detail: "Пароль изменен" });
    expect(apiClient.post).toHaveBeenCalledWith("user/auth/password/change/", payload);
  });
});
