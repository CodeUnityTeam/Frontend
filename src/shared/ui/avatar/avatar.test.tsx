import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Avatar, AvatarFallback } from "./avatar";

describe("Avatar", () => {
  it("renders fallback content when no image is supplied", async () => {
    // Init
    render(
      <Avatar>
        <AvatarFallback delayMs={0}>AB</AvatarFallback>
      </Avatar>,
    );

    // Action
    const fallback = await screen.findByText("AB");

    // Assert
    expect(fallback).toBeInTheDocument();
    expect(fallback).toHaveClass("bg-disabled");
  });
});
