import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { TextInput } from "./text-input";

describe("TextInput", () => {
  it("forwards input, styling, and ref props", () => {
    // Init
    const inputRef = createRef<HTMLInputElement>();

    // Action
    render(
      <TextInput
        ref={inputRef}
        label="Email"
        description="Used for account updates"
        error="Enter a valid email"
        name="email"
        placeholder="you@example.com"
        defaultValue="ada@example.com"
        className="field-layout"
        inputClassName="email-input"
      />,
    );

    // Assert
    const input = screen.getByPlaceholderText("you@example.com");
    expect(input).toHaveAttribute("name", "email");
    expect(input).toHaveAttribute("placeholder", "you@example.com");
    expect(input).toHaveValue("ada@example.com");
    expect(input).toHaveClass("email-input");
    expect(inputRef.current).toBe(input);
    expect(screen.getByText("Used for account updates")).toBeInTheDocument();
    expect(screen.getByText("Enter a valid email")).toBeInTheDocument();
  });

  it("omits optional field feedback when it is not supplied", () => {
    // Init
    render(<TextInput placeholder="Search" />);

    // Action
    const input = screen.getByPlaceholderText("Search");

    // Assert
    expect(input).not.toHaveAccessibleName();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
