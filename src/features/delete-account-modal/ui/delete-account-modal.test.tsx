import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/render-with-providers";
import { clearTokens } from "@/shared/lib/auth";
import { toast } from "sonner";
import { useDeleteAccount } from "../model/delete-account-mutation";
import { DeleteAccountModal } from "./delete-account-modal";

const mutate = vi.fn();

vi.mock("../model/delete-account-mutation", () => ({ useDeleteAccount: vi.fn() }));
vi.mock("@/shared/lib/auth", () => ({ clearTokens: vi.fn() }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("@/features/confirm-modal", () => ({
  ConfirmModal: ({ open, onConfirm, onOpenChange, title, confirmText, cancelText }: { open: boolean; onConfirm: () => void; onOpenChange: (open: boolean) => void; title: string; confirmText: string; cancelText: string }) => open ? <section><h2>{title}</h2><button onClick={onConfirm}>{confirmText}</button><button onClick={() => onOpenChange(false)}>{cancelText}</button></section> : null,
}));

describe("DeleteAccountModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useDeleteAccount).mockReturnValue({ mutate } as never);
  });

  it("delegates confirmation, then clears session, routes home, and reports success", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    renderWithProviders(<DeleteAccountModal open onOpenChange={vi.fn()} onConfirm={onConfirm} />, { withRouter: true, initialEntry: "/account" });

    // Confirmation and mutation delegation
    await user.click(screen.getByRole("button", { name: "Удалить" }));
    expect(onConfirm).toHaveBeenCalledOnce();
    expect(mutate).toHaveBeenCalledWith(undefined, expect.any(Object));
    const options = mutate.mock.calls[0]?.[1];

    // Success callback effects
    options?.onSuccess?.({ detail: "Аккаунт удален" });

    expect(clearTokens).toHaveBeenCalledOnce();
    expect(toast.success).toHaveBeenCalledWith("Аккаунт удален");

    // Error callback effects
    options?.onError?.(new Error("Удаление недоступно"));
    expect(toast.error).toHaveBeenCalledWith("Удаление недоступно");
  });

  it("leaves cancellation to the confirm modal without issuing a mutation", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderWithProviders(<DeleteAccountModal open onOpenChange={onOpenChange} />, { withRouter: true });
    await user.click(screen.getByRole("button", { name: "Отменить" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(mutate).not.toHaveBeenCalled();
  });
});
