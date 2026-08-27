import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { forwardRef } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/render-with-providers";
import { toast } from "sonner";
import { useChangePasswordMutation } from "../model/use-change-password-mutation";
import { ChangePasswordModal } from "./change-password-modal";

const mutate = vi.fn();

vi.mock("../model/use-change-password-mutation", () => ({ useChangePasswordMutation: vi.fn() }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("@iconify/react", () => ({ Icon: () => null }));
vi.mock("@/shared/ui/dialog", () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) => open ? <div>{children}</div> : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <header>{children}</header>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
}));
vi.mock("@/shared/ui/input", () => ({
  Input: forwardRef<HTMLInputElement, React.ComponentProps<"input"> & { label: string; error?: string; rightElement?: React.ReactNode }>(({ label, error, rightElement, ...props }, ref) => <label>{label}<input ref={ref} {...props} />{rightElement}{error && <span>{error}</span>}</label>),
}));
vi.mock("@/shared/ui/button", () => ({ Button: (props: React.ComponentProps<"button">) => <button {...props} /> }));

describe("ChangePasswordModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useChangePasswordMutation).mockReturnValue({ mutate, isPending: false } as never);
  });

  it("guards invalid passwords and clears form state when cancelled", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderWithProviders(<ChangePasswordModal open onOpenChange={onOpenChange} />);

    // Validation feedback
    await user.click(screen.getByLabelText("Текущий пароль"));
    await user.tab();
    expect(await screen.findByText("Введите текущий пароль")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Изменить" })).toBeDisabled();

    // Cancellation effects
    await user.click(screen.getByRole("button", { name: "Отменить" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByLabelText("Текущий пароль")).toHaveValue("");
    expect(mutate).not.toHaveBeenCalled();
  });

  it("delegates valid data and applies success and error side effects", async () => {
    // Setup
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderWithProviders(<ChangePasswordModal open onOpenChange={onOpenChange} />);

    // Submission
    await user.type(screen.getByLabelText("Текущий пароль"), "current1");
    await user.type(screen.getByLabelText("Новый пароль"), "updated1");
    await user.click(screen.getByRole("button", { name: "Изменить" }));

    // Immediate mutation assertion
    expect(mutate).toHaveBeenCalledWith({ old_password: "current1", new_password: "updated1" }, expect.any(Object));
    const options = mutate.mock.calls[0]?.[1];

    // Success callback effects
    options?.onSuccess?.({ detail: "Пароль изменен" });
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(toast.success).toHaveBeenCalledWith("Пароль изменен");

    // Error callback effects
    options?.onError?.(new Error("Неверный пароль"));
    expect(toast.error).toHaveBeenCalledWith("Неверный пароль");
  });

  it("disables submission while the mutation is pending", () => {
    vi.mocked(useChangePasswordMutation).mockReturnValue({ mutate, isPending: true } as never);
    renderWithProviders(<ChangePasswordModal open />);
    expect(screen.getByRole("button", { name: "Изменить" })).toBeDisabled();
  });
});
