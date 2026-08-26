import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const { sonner } = vi.hoisted(() => ({
  sonner: vi.fn((props) => <div data-testid="sonner" data-position={props.position} />),
}));

vi.mock("sonner", () => ({ Toaster: sonner }));

import { Toaster } from "./sonner";

describe("Toaster", () => {
  it("forwards consumer options while supplying the project toast theme and status icons", () => {
    // Init
    render(<Toaster position="top-right" />);

    // Action
    const toaster = screen.getByTestId("sonner");

    // Assert
    expect(toaster).toHaveAttribute("data-position", "top-right");
    expect(sonner).toHaveBeenCalledWith(
      expect.objectContaining({
        className: "toaster group",
        icons: expect.objectContaining({ success: expect.anything(), error: expect.anything() }),
        toastOptions: expect.objectContaining({ classNames: expect.any(Object) }),
      }),
      expect.any(Object),
    );
  });
});
