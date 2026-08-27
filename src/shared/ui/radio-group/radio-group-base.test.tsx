import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { RadioGroup, RadioGroupItem } from "./radio-group-base";

describe("RadioGroup", () => {
  it("exposes and changes the selected radio option", async () => {
    // Init
    const user = userEvent.setup();
    render(
      <RadioGroup aria-label="Role" defaultValue="designer">
        <RadioGroupItem value="designer" aria-label="Designer" />
        <RadioGroupItem value="developer" aria-label="Developer" />
      </RadioGroup>,
    );

    // Action
    await user.click(screen.getByRole("radio", { name: "Developer" }));

    // Assert
    expect(screen.getByRole("radio", { name: "Developer" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Designer" })).not.toBeChecked();
  });
});
