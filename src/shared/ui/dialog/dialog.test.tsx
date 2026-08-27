import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./dialog";

describe("DialogContent", () => {
  it("opens from its trigger and closes through the wrapper-provided close button", async () => {
    // Init
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open details</DialogTrigger>
        <DialogContent>
          <DialogTitle>Details</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    // Action
    await user.click(screen.getByRole("button", { name: "Open details" }));
    await user.click(screen.getByRole("button", { name: "Close" }));

    // Assert
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
