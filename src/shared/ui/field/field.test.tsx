import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Field, FieldError, FieldSeparator } from "./field";

describe("Field primitives", () => {
  it("exposes orientation, error semantics, and labelled separator content", () => {
    // Init
    render(
      <Field orientation="horizontal">
        <FieldError errors={[{ message: "First problem" }, { message: "Second problem" }]} />
        <FieldSeparator>or</FieldSeparator>
      </Field>,
    );

    // Action
    const field = screen.getByRole("group");

    // Assert
    expect(field).toHaveAttribute("data-orientation", "horizontal");
    expect(screen.getByRole("alert")).toHaveTextContent("First problem");
    expect(screen.getByRole("alert")).toHaveTextContent("Second problem");
    expect(screen.getByText("or")).toHaveAttribute("data-slot", "field-separator-content");
  });
});
