import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
  it("supports keyboard-accessible checked state changes", async () => {
    // Init
    const user = userEvent.setup();
    render(<Checkbox aria-label="Accept terms" />);
    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });

    // Action
    await user.click(checkbox);

    // Assert
    expect(checkbox).toBeChecked();
  });
});
