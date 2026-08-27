import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "./button";

describe("Button", () => {
  it("composes child links when requested while preserving custom button styles", () => {
    // Init
    render(
      <Button asChild variant="outline" className="cta">
        <a href="/projects">Projects</a>
      </Button>,
    );

    // Action
    const link = screen.getByRole("link", { name: "Projects" });

    // Assert
    expect(link).toHaveAttribute("href", "/projects");
    expect(link).toHaveClass("cta");
  });
});
