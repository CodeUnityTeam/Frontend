import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Slider } from "./slider";

describe("Slider", () => {
  it("updates its accessible value with keyboard interaction", async () => {
    // Init
    const user = userEvent.setup();
    render(<Slider defaultValue={[20]} max={100} step={10} />);
    const slider = screen.getByRole("slider");

    // Action
    slider.focus();
    await user.keyboard("{ArrowRight}");

    // Assert
    expect(slider).toHaveAttribute("aria-valuenow", "30");
  });
});
