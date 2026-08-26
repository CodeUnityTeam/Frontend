import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";

describe("Card", () => {
  it("composes semantic content regions and keeps consumer classes on each wrapper", () => {
    // Init
    render(
      <Card className="profile-card">
        <CardHeader className="profile-header">
          <CardTitle>Profile</CardTitle>
          <CardDescription>Public information</CardDescription>
        </CardHeader>
        <CardContent>Body</CardContent>
      </Card>,
    );

    // Action
    const card = screen.getByText("Body").parentElement;

    // Assert
    expect(card).toHaveClass("profile-card");
    expect(screen.getByText("Profile").parentElement).toHaveClass("profile-header");
    expect(screen.getByText("Public information")).toHaveClass("text-muted-foreground");
  });
});
