import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TagInput } from "./tag-input";

describe("TagInput", () => {
  it("commits comma-separated values, canonicalizes suggestions, and ignores duplicates", async () => {
    // Init
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <TagInput
        label="Skills"
        placeholder="Add a skill"
        value={["React"]}
        onChange={onChange}
        suggestions={["React", "TypeScript", "Testing"]}
      />,
    );
    const input = screen.getByRole("textbox", { name: "Skills" });

    // Action
    await user.type(input, "typescript, React,");

    // Assert
    expect(onChange).toHaveBeenCalledWith(["React", "TypeScript"]);
    expect(input).toHaveValue("");
  });

  it("shows matching suggestions and adds the selected suggestion without losing input focus", async () => {
    // Init
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <TagInput
        label="Skills"
        value={[]}
        onChange={onChange}
        suggestions={["React", "TypeScript"]}
      />,
    );
    const input = screen.getByRole("textbox", { name: "Skills" });

    // Action
    await user.type(input, "rea");
    await user.click(screen.getByRole("button", { name: "React" }));

    // Assert
    expect(onChange).toHaveBeenCalledWith(["React"]);
    // The list prevents its mousedown default so the input does not blur before the click adds the tag.
    expect(input).toHaveFocus();
  });

  it("removes the final tag when Backspace is pressed on an empty input", async () => {
    // Init
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TagInput label="Skills" value={["React", "Testing"]} onChange={onChange} />);

    // Action
    await user.click(screen.getByRole("textbox", { name: "Skills" }));
    await user.keyboard("{Backspace}");

    // Assert
    expect(onChange).toHaveBeenCalledWith(["React"]);
  });
});
