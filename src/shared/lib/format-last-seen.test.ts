import { afterEach, describe, expect, it, vi } from "vitest";

import { formatLastSeen } from "./format-last-seen";

describe("formatLastSeen", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("labels timestamps from today and yesterday using calendar days rather than elapsed hours", () => {
    // Init
    // Fake time fixes the calendar boundary so this assertion is independent of the machine clock.
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 4, 10, 0, 30));

    // Action
    const today = formatLastSeen(new Date(2025, 4, 10, 0, 1).toISOString());
    const yesterday = formatLastSeen(new Date(2025, 4, 9, 23, 59).toISOString());

    // Assert
    expect(today).toBe("сегодня");
    expect(yesterday).toBe("вчера");
  });

  it("formats older dates with the year only when it differs from the current year", () => {
    // Init
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 4, 10, 12));

    // Action
    const sameYear = formatLastSeen(new Date(2025, 2, 5, 12).toISOString());
    const previousYear = formatLastSeen(new Date(2024, 2, 5, 12).toISOString());

    // Assert
    expect(sameYear).toBe("5 марта");
    expect(previousYear).toBe("5 марта 2024 г.");
  });

  it("returns undefined for missing and invalid timestamps", () => {
    // Init
    const invalid = "not-a-date";

    // Action
    const values = [formatLastSeen(null), formatLastSeen(invalid)];

    // Assert
    expect(values).toEqual([undefined, undefined]);
  });
});
