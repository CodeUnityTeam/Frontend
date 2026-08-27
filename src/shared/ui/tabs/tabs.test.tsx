import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

describe("Tabs", () => {
  it("switches the exposed tab panel through its accessible tab controls", async () => {
    // Init
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="first">
        <TabsList aria-label="Sections">
          <TabsTrigger value="first">First</TabsTrigger>
          <TabsTrigger value="second">Second</TabsTrigger>
        </TabsList>
        <TabsContent value="first">First panel</TabsContent>
        <TabsContent value="second">Second panel</TabsContent>
      </Tabs>,
    );

    // Action
    await user.click(screen.getByRole("tab", { name: "Second" }));

    // Assert
    expect(screen.getByRole("tab", { name: "Second" })).toHaveAttribute(
      "data-state",
      "active",
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Second panel");
  });
});
