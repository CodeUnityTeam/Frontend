import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PageContainer } from "./page-container/page-container";
import { Tag } from "./tag/tag";
import {
  Modal,
  ModalBody,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "./modal/modal";
import {
  AlertModal,
  AlertModalAction,
  AlertModalCancel,
  AlertModalDescription,
  AlertModalFooter,
  AlertModalHeader,
  AlertModalTitle,
} from "./modal/alert-modal";

describe("remaining shared UI public contracts", () => {
  it("renders tag label fallback, variant styling, and click callback", () => {
    // Init
    const onClick = vi.fn();
    render(<Tag label="React" variant="outline" className="catalog-tag" onClick={onClick} />);

    // Action
    fireEvent.click(screen.getByText("React"));

    // Assert
    expect(screen.getByText("React")).toHaveClass("border", "text-lg", "catalog-tag");
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("prefers explicit tag children over the label", () => {
    // Init
    render(<Tag label="Ignored label">Visible child</Tag>);

    // Action
    const tag = screen.getByText("Visible child");

    // Assert
    expect(tag).toHaveClass("bg-muted", "text-foreground");
    expect(screen.queryByText("Ignored label")).not.toBeInTheDocument();
  });

  it("passes standard div props through the page container", () => {
    // Init
    render(<PageContainer data-testid="page" className="content-area">Content</PageContainer>);

    // Action
    const container = screen.getByTestId("page");

    // Assert
    expect(container).toHaveTextContent("Content");
    expect(container).toHaveClass("content-area", "px-[clamp(1rem,calc(1rem+(100vw-20rem)*64/1120),5rem)]");
  });

  it("composes modal slots and forwards close changes from the header control", () => {
    // Init
    const onOpenChange = vi.fn();
    render(
      <Modal open onOpenChange={onOpenChange} className="profile-modal">
        <ModalHeader className="modal-header">
          <ModalTitle>Profile</ModalTitle>
        </ModalHeader>
        <ModalDescription>Update profile details</ModalDescription>
        <ModalBody className="modal-body">Form fields</ModalBody>
        <ModalFooter className="modal-footer">Save</ModalFooter>
      </Modal>,
    );

    // Action
    fireEvent.click(screen.getByRole("button", { name: "Close modal" }));

    // Assert
    expect(screen.getByRole("dialog")).toHaveClass("profile-modal");
    expect(screen.getByRole("heading", { name: "Profile" })).toBeInTheDocument();
    expect(screen.getByText("Update profile details")).toBeInTheDocument();
    expect(screen.getByText("Form fields")).toHaveClass("modal-body");
    expect(screen.getByText("Save")).toHaveClass("modal-footer");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("keeps alert modals open on overlay clicks by default", () => {
    // Init
    const onOpenChange = vi.fn();
    const { baseElement } = render(
      <AlertModal open onOpenChange={onOpenChange}>
        <AlertModalHeader><AlertModalTitle>Delete project</AlertModalTitle></AlertModalHeader>
        <AlertModalDescription>This cannot be undone.</AlertModalDescription>
        <AlertModalFooter>
          <AlertModalCancel>Cancel</AlertModalCancel>
          <AlertModalAction>Delete</AlertModalAction>
        </AlertModalFooter>
      </AlertModal>,
    );

    // Action
    fireEvent.pointerDown(baseElement.querySelector('[class*="bg-black"]')!);

    // Assert
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toHaveClass("bg-destructive");
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("closes alert modals from an enabled overlay click", () => {
    // Init
    const onOpenChange = vi.fn();
    const { baseElement } = render(
      <AlertModal open onOpenChange={onOpenChange} closeOnOutsideClick>
        <AlertModalTitle>Discard changes</AlertModalTitle>
      </AlertModal>,
    );

    // Action
    // The overlay handler is a public opt-in escape route for this otherwise blocking dialog.
    fireEvent.pointerDown(baseElement.querySelector('[class*="bg-black"]')!);

    // Assert
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
