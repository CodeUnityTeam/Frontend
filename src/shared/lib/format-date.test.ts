import { describe, expect, it } from "vitest";

import { formatDate } from "./format-date";

describe("formatDate", () => {
  it("formats a valid ISO timestamp using the Russian numeric date convention", () => {
    // Init
    const iso = "2025-01-02T12:00:00Z";

    // Action
    const formatted = formatDate(iso);

    // Assert
    expect(formatted).toBe("02.01.2025");
  });

  it("returns an empty string for missing and invalid input", () => {
    // Init
    const invalid = "not-a-date";

    // Action
    const values = [formatDate(null), formatDate(""), formatDate(invalid)];

    // Assert
    expect(values).toEqual(["", "", ""]);
  });
});
