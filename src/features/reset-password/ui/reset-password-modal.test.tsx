import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/render-with-providers";
import { toast } from "sonner";
import { useResetPassword } from "../model/use-reset-mutation";
import { ResetPasswordModal } from "./reset-password-modal";

const mutate = vi.fn();

vi.mock("../model/use-reset-mutation", () => ({ useResetPassword: vi.fn() }));
vi.mock("sonner", () => ({ toast: { error: vi.fn() } }));
vi.mock("@/shared/ui/dialog", () => ({
  Dialog: ({ children, open, onOpenChange }: { children: React.ReactNode; open: boolean; onOpenChange: (open: boolean) => void }) => open ? <section><button onClick={() => onOpenChange(false)}>Dismiss</button>{children}</section> : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock("./reset-password-form", () => ({
  ResetPasswordForm: ({ onSubmit, onBack, isPending }: { onSubmit: (email: string) => void; onBack: () => void; isPending?: boolean }) => <><button disabled={isPending} onClick={() => onSubmit("user@example.com")}>Submit reset</button><button onClick={onBack}>Back</button></>,
}));
vi.mock("./reset-password-success", () => ({
  ResetPasswordSuccess: ({ email, onClose, onResend }: { email: string; onClose: () => void; onResend: () => void }) => <><p>Sent to {email}</p><button onClick={onClose}>Close success</button><button onClick={onResend}>Resend</button></>,
}));

describe("ResetPasswordModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useResetPassword).mockReturnValue({ mutate, isPending: false } as never);
  });

  it("delegates submission, displays success, resends to the same address, and resets on close", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProviders(<ResetPasswordModal open onClose={onClose} onBack={vi.fn()} />);

    // Reset-link submission
    await user.click(screen.getByRole("button", { name: "Submit reset" }));
    expect(mutate).toHaveBeenCalledWith("user@example.com", expect.any(Object));
    const options = mutate.mock.calls[0]?.[1];

    // Success-state transition
    options?.onSuccess?.();
    expect(await screen.findByText("Sent to user@example.com")).toBeInTheDocument();

    // Resend and close actions
    await user.click(screen.getByRole("button", { name: "Resend" }));
    expect(mutate).toHaveBeenLastCalledWith("user@example.com");
    await user.click(screen.getByRole("button", { name: "Close success" }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("reports mutation failure and returns to login from the form", async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    renderWithProviders(<ResetPasswordModal open onClose={vi.fn()} onBack={onBack} />);

    // Submission and error callback effects
    await user.click(screen.getByRole("button", { name: "Submit reset" }));
    mutate.mock.calls[0]?.[1]?.onError?.(new Error("Email не найден"));
    expect(toast.error).toHaveBeenCalledWith("Email не найден");

    // Return-to-login action
    await user.click(screen.getByRole("button", { name: "Back" }));
    expect(onBack).toHaveBeenCalledOnce();
  });
});
