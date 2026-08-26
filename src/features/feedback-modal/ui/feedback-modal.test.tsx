import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/render-with-providers";
import { FeedbackModal } from "./feedback-modal";

const modal = vi.fn();

vi.mock("@/shared/ui/modal/modal", () => ({
  Modal: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
    modal(props);
    return props.open ? <div>{children}</div> : null;
  },
  ModalHeader: ({ children }: React.PropsWithChildren) => <header>{children}</header>,
  ModalTitle: ({ children }: React.PropsWithChildren) => <h2>{children}</h2>,
  ModalBody: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  ModalFooter: ({ children }: React.PropsWithChildren) => <footer>{children}</footer>,
}));

describe("FeedbackModal", () => {
  it("presents the accessible feedback fields and available actions when open", () => {
    renderWithProviders(<FeedbackModal open onOpenChange={vi.fn()} />);

    expect(screen.getByRole("heading", { name: "Форма обратной связи" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Введите текст")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Расскажите о своей проблеме или предложении")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Прикрепить данные" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Отправить" })).toHaveAttribute("type", "submit");
  });

  it("propagates controlled open state to the shared modal", () => {
    const onOpenChange = vi.fn();
    const { rerender } = renderWithProviders(<FeedbackModal open={false} onOpenChange={onOpenChange} />);

    expect(screen.queryByRole("heading", { name: "Форма обратной связи" })).not.toBeInTheDocument();
    expect(modal).toHaveBeenLastCalledWith(expect.objectContaining({ open: false, onOpenChange }));

    rerender(<FeedbackModal open onOpenChange={onOpenChange} />);

    expect(screen.getByRole("heading", { name: "Форма обратной связи" })).toBeInTheDocument();
    expect(modal).toHaveBeenLastCalledWith(expect.objectContaining({ open: true, onOpenChange }));
  });
});
