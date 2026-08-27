import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { changeEmailApi } from "@/features/change-email-modal/api/change-email-api";
import { useChangeEmailMutation } from "./use-change-email-mutation";

vi.mock("@/features/change-email-modal/api/change-email-api", () => ({
  changeEmailApi: vi.fn(),
}));

describe("useChangeEmailMutation", () => {
  it("runs the change-email API mutation with the provided email", async () => {
    vi.mocked(changeEmailApi).mockResolvedValueOnce({ detail: "Готово" });
    const client = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
    const { result } = renderHook(() => useChangeEmailMutation(), { wrapper });

    result.current.mutate("new@example.com");

    await waitFor(() => {
      expect(changeEmailApi).toHaveBeenCalledWith(
        "new@example.com",
        expect.any(Object),
      );
    });
  });
});
