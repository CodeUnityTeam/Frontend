import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Input } from "./input";

describe("Input", () => {
  it("associates its generated input id with the label and exposes validation feedback", () => {
    // Init
    render(
      <Input
        label="Email"
        error="Enter a valid address"
        leftElement={<span aria-hidden="true">@</span>}
        rightElement={<button type="button">Clear</button>}
      />,
    );

    // Action
    const input = screen.getByRole("textbox", { name: "Email" });

    // Assert
    expect(input).toHaveAttribute("id");
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid address");
    expect(screen.getByRole("button", { name: "Clear" })).toBeInTheDocument();
  });
});
