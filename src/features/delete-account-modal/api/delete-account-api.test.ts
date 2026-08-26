import { describe, expect, it, vi } from "vitest";

import { apiClient } from "@/shared/api";
import { deleteAccountApi } from "./delete-account-api";

vi.mock("@/shared/api", () => ({ apiClient: { delete: vi.fn() } }));

describe("deleteAccountApi", () => {
  it("deletes the current profile and returns the server detail", async () => {
    vi.mocked(apiClient.delete).mockResolvedValueOnce({ data: { detail: "Аккаунт удален" } });

    await expect(deleteAccountApi()).resolves.toEqual({ detail: "Аккаунт удален" });
    expect(apiClient.delete).toHaveBeenCalledWith("/user/profile/me/");
  });
});
