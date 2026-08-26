import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./sheet";

describe("SheetContent", () => {
  it("opens from its trigger and exposes the optional localized close control", async () => {
    // Init
    const user = userEvent.setup();
    render(
      <Sheet>
        <SheetTrigger>Open filters</SheetTrigger>
        <SheetContent side="left" showClose>
          <SheetTitle>Filters</SheetTitle>
        </SheetContent>
      </Sheet>,
    );

    // Action
    await user.click(screen.getByRole("button", { name: "Open filters" }));

    // Assert
    expect(screen.getByRole("dialog")).toHaveClass("left-0");
    expect(screen.getByRole("button", { name: "Закрыть" })).toBeInTheDocument();
  });
});
