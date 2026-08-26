import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Textarea } from "./textarea";

describe("Textarea", () => {
  it("provides an accessible labelled textarea with an error alert", () => {
    // Init
    render(<Textarea label="Message" error="Message is required" />);

    // Action
    const textarea = screen.getByRole("textbox", { name: "Message" });

    // Assert
    expect(textarea.tagName).toBe("TEXTAREA");
    expect(screen.getByRole("alert")).toHaveTextContent("Message is required");
  });
});
