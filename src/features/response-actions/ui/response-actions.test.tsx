import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useUpdateResponseStatus } from "@/entities/response";
import { renderWithProviders } from "@/test/render-with-providers";
import { ResponseActions } from "./response-actions";

const mutate = vi.fn();

vi.mock("@/entities/response", () => ({ useUpdateResponseStatus: vi.fn() }));

describe("ResponseActions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useUpdateResponseStatus).mockReturnValue({ mutate, isPending: false } as unknown as ReturnType<typeof useUpdateResponseStatus>);
  });

  it("hides actions for responses that are no longer pending", () => {
    renderWithProviders(<ResponseActions responseId="response-1" currentStatus="approved" userRole="employer" />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("uses worker approval copy and sends approval payload", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    const { queryClient } = renderWithProviders(<ResponseActions responseId="response-1" currentStatus="pending" userRole="worker" onAction={onAction} />);
    const invalidateQueries = vi.spyOn(queryClient, "invalidateQueries");

    // Approval submission
    await user.click(screen.getByRole("button", { name: "Принять приглашение" }));
    expect(mutate).toHaveBeenCalledWith({ responseId: "response-1", status: "approved" }, expect.any(Object));

    // Success callback effects
    mutate.mock.calls[0]?.[1]?.onSuccess?.();
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ["people-responses"] });
    expect(onAction).toHaveBeenCalledOnce();
  });

  it("uses employer copy, disables both actions while pending, and sends rejection payload", async () => {
    const user = userEvent.setup();
    vi.mocked(useUpdateResponseStatus).mockReturnValue({ mutate, isPending: true } as unknown as ReturnType<typeof useUpdateResponseStatus>);
    const { unmount } = renderWithProviders(<ResponseActions responseId="response-1" currentStatus="pending" userRole="employer" />);

    // Pending-state guard
    expect(screen.getByRole("button", { name: "..." })).toBeDisabled();
    expect(screen.getAllByRole("button")[1]).toBeDisabled();

    // Enabled rejection submission
    vi.mocked(useUpdateResponseStatus).mockReturnValue({ mutate, isPending: false } as unknown as ReturnType<typeof useUpdateResponseStatus>);
    unmount();
    renderWithProviders(<ResponseActions responseId="response-1" currentStatus="pending" userRole="employer" />);
    expect(screen.getByRole("button", { name: "Одобрить" })).toBeEnabled();
    await user.click(screen.getAllByRole("button")[1]);
    expect(mutate).toHaveBeenCalledWith({ responseId: "response-1", status: "rejected" }, expect.any(Object));
  });
});
