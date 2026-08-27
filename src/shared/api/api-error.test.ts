import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ isAxiosError: vi.fn() }));

vi.mock("axios", () => ({ isAxiosError: mocks.isAxiosError }));

import { ApiError, toApiError } from "./api-error";

describe("toApiError", () => {
  it("preserves a client-side backend validation message and response metadata", () => {
    // Init
    const data = { email: ["Already in use"], detail: "Ignored after first message" };
    mocks.isAxiosError.mockReturnValue(true);

    // Action
    const error = toApiError({ response: { status: 400, data } });

    // Assert
    expect(error).toEqual(expect.objectContaining({
      name: "ApiError",
      message: "Already in use",
      status: 400,
      data,
    }));
  });

  it("does not expose backend response details for server failures", () => {
    // Init
    mocks.isAxiosError.mockReturnValue(true);

    // Action
    const error = toApiError({ response: { status: 500, data: { detail: "Sensitive internal detail" } } });

    // Assert
    expect(error.message).toBe("Ошибка сервера. Попробуйте позже.");
    expect(error.data).toEqual({ detail: "Sensitive internal detail" });
  });

  it("maps missing responses and non-Axios errors to the safe fallback", () => {
    // Init
    mocks.isAxiosError.mockReturnValueOnce(true).mockReturnValueOnce(false);

    // Action
    const networkError = toApiError({ response: undefined });
    const unknownError = toApiError(new Error("unexpected"));

    // Assert
    expect(networkError).toBeInstanceOf(ApiError);
    expect(networkError.message).toBe("Не удалось выполнить запрос. Попробуйте позже.");
    expect(unknownError).toEqual(expect.objectContaining({ status: undefined, data: undefined }));
  });
});
