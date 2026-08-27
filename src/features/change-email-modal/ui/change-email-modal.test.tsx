import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useChangeEmailMutation } from "@/features/change-email-modal/model/use-change-email-mutation";
import { toast } from "sonner";
import { ChangeEmailModal } from "./change-email-modal";

const mutate = vi.fn();

vi.mock(
  "@/features/change-email-modal/model/use-change-email-mutation",
  () => ({
    useChangeEmailMutation: vi.fn(),
  }),
);

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/shared/ui/dialog", () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <div>{children}</div> : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <header>{children}</header>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
}));

describe("ChangeEmailModal", () => {
  afterEach(cleanup);

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useChangeEmailMutation).mockReturnValue({
      mutate,
      isPending: false,
    } as unknown as ReturnType<typeof useChangeEmailMutation>);
  });

  it("shows validation feedback and prevents submission for an invalid email", async () => {
    const user = userEvent.setup();
    render(<ChangeEmailModal open />);

    const emailInput = screen.getByLabelText("Новый E-mail");
    await user.click(emailInput);
    await user.tab();

    expect(await screen.findByText("Введите email")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Изменить" })).toBeDisabled();
    expect(mutate).not.toHaveBeenCalled();
  });

  it("resets the form and reports closing when cancelled", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<ChangeEmailModal open onOpenChange={onOpenChange} />);

    await user.type(screen.getByLabelText("Новый E-mail"), "new@example.com");
    await user.click(screen.getByRole("button", { name: "Отменить" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByLabelText("Новый E-mail")).toHaveValue("");
  });

  it("submits a valid email, closes the modal and shows a success toast", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<ChangeEmailModal open onOpenChange={onOpenChange} />);

    // Submission
    await user.type(screen.getByLabelText("Новый E-mail"), "new@example.com");
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Изменить" })).toBeEnabled(),
    );
    await user.click(screen.getByRole("button", { name: "Изменить" }));

    // Mutation delegation
    expect(mutate).toHaveBeenCalledWith("new@example.com", expect.any(Object));
    const options = mutate.mock.calls[0]?.[1];

    // Success callback effects
    options?.onSuccess?.({ detail: "Письмо отправлено" });

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(toast.success).toHaveBeenCalledWith("Письмо отправлено");
  });

  it("shows an error toast when the email change request fails", async () => {
    const user = userEvent.setup();
    render(<ChangeEmailModal open />);

    await user.type(screen.getByLabelText("Новый E-mail"), "new@example.com");
    await user.click(screen.getByRole("button", { name: "Изменить" }));

    // Error callback effects
    const options = mutate.mock.calls[0]?.[1];
    options?.onError?.(new Error("Адрес уже используется"));

    expect(toast.error).toHaveBeenCalledWith("Адрес уже используется");
  });
});
