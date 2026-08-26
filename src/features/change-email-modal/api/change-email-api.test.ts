import { describe, expect, it, vi } from "vitest";

import { apiClient } from "@/shared/api";
import { changeEmailApi } from "./change-email-api";

vi.mock("@/shared/api", () => ({
  apiClient: { post: vi.fn() },
}));

describe("changeEmailApi", () => {
  it("sends the new email to the email-change endpoint and returns its response", async () => {
    const response = { detail: "Письмо отправлено" };
    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: response });

    await expect(changeEmailApi("new@example.com")).resolves.toEqual(response);

    expect(apiClient.post).toHaveBeenCalledWith("user/profile/email-change/", {
      new_email: "new@example.com",
    });
  });
});
