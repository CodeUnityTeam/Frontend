import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/render-with-providers";
import { ConfirmModal } from "./confirm-modal";

const alertModal = vi.fn();

vi.mock("@/shared/ui/modal/alert-modal", () => ({
  AlertModal: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
    alertModal(props);
    return <div>{children}</div>;
  },
  AlertModalHeader: ({ children }: React.PropsWithChildren) => <header>{children}</header>,
  AlertModalTitle: ({ children }: React.PropsWithChildren) => <h2>{children}</h2>,
  AlertModalDescription: ({ children }: React.PropsWithChildren) => <p>{children}</p>,
  AlertModalFooter: ({ children }: React.PropsWithChildren) => <footer>{children}</footer>,
  AlertModalAction: ({ children, ...props }: React.ComponentProps<"button">) => <button {...props}>{children}</button>,
  AlertModalCancel: ({ children, ...props }: React.ComponentProps<"button">) => <button {...props}>{children}</button>,
}));

describe("ConfirmModal", () => {
  it("renders supplied copy and invokes the confirm callback", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    renderWithProviders(
      <ConfirmModal
        open
        onOpenChange={vi.fn()}
        title="Remove project?"
        description="This cannot be undone."
        confirmText="Remove"
        cancelText="Keep"
        onConfirm={onConfirm}
      />,
    );

    expect(screen.getByRole("heading", { name: "Remove project?" })).toBeInTheDocument();
    expect(screen.getByText("This cannot be undone.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Remove" }));
    expect(onConfirm).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: "Keep" })).toBeEnabled();
  });

  it("uses loading copy and disables both actions while loading", () => {
    renderWithProviders(
      <ConfirmModal
        open
        onOpenChange={vi.fn()}
        title="Remove project?"
        description="This cannot be undone."
        confirmText="Remove"
        cancelText="Keep"
        isLoading
        loadingText="Removing..."
      />,
    );

    expect(screen.getByRole("button", { name: "Removing..." })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Keep" })).toBeDisabled();
  });

  it("forwards outside-click behavior and leaves it unspecified by default", () => {
    const { rerender } = renderWithProviders(
      <ConfirmModal open onOpenChange={vi.fn()} title="Title" description="Description" />,
    );

    expect(alertModal).toHaveBeenLastCalledWith(expect.objectContaining({ closeOnOutsideClick: undefined }));

    // Explicit outside-click behavior
    rerender(
      <ConfirmModal open onOpenChange={vi.fn()} title="Title" description="Description" closeOnOutsideClick />,
    );

    expect(alertModal).toHaveBeenLastCalledWith(expect.objectContaining({ closeOnOutsideClick: true }));
  });
});
