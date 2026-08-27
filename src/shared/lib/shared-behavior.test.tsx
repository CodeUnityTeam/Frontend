import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { formatRelativeDate } from "./pluralize";
import { cn } from "./utils";
import { useModal } from "./hooks/use-modal";
import { useProjectStatus } from "./hooks/use-project-status";

describe("shared library public contracts", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("merges conditional Tailwind classes with the last conflicting value", () => {
    // Init
    const conditionalClass = true && "font-semibold";

    // Action
    const result = cn("px-2 text-sm", conditionalClass, "px-4");

    // Assert
    expect(result).toBe("text-sm font-semibold px-4");
  });

  it("formats relative dates using the Russian day declensions", () => {
    // Init
    // Freeze time so date-only inputs yield deterministic elapsed-day values.
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-26T12:00:00.000Z"));

    // Action
    const today = formatRelativeDate("2026-08-26T08:00:00.000Z");
    const singular = formatRelativeDate("2026-08-25T12:00:00.000Z");
    const paucal = formatRelativeDate("2026-08-24T12:00:00.000Z");
    const teen = formatRelativeDate("2026-08-14T12:00:00.000Z");
    const plural = formatRelativeDate("2026-08-21T12:00:00.000Z");

    // Assert
    expect(today).toBe("Сегодня");
    expect(singular).toBe("1 день назад");
    expect(paucal).toBe("2 дня назад");
    expect(teen).toBe("12 дней назад");
    expect(plural).toBe("5 дней назад");
  });

  it("exposes independent modal open, close, toggle, and direct-set controls", () => {
    // Init
    const { result } = renderHook(() => useModal());

    // Action
    act(() => result.current.openModal());

    // Assert
    expect(result.current.open).toBe(true);

    // Action
    act(() => result.current.toggleModal());

    // Assert
    expect(result.current.open).toBe(false);

    // Action
    act(() => result.current.setOpen(true));

    // Assert
    expect(result.current.open).toBe(true);

    // Action
    act(() => result.current.closeModal());

    // Assert
    expect(result.current.open).toBe(false);
  });

  it("honors the initial modal visibility", () => {
    // Init
    const { result } = renderHook(() => useModal(true));

    // Action
    const open = result.current.open;

    // Assert
    expect(open).toBe(true);
  });

  it("selects project statuses according to the active tab and role", () => {
    // Init
    const cases = [
      { tab: "my-projects", isEmployer: true, expected: ["draft", "published", "recruiting_closed"] },
      { tab: "my-projects", isEmployer: false, expected: ["published"] },
      { tab: "favorites", isEmployer: false, expected: ["published", "recruiting_closed"] },
      { tab: "browse", isEmployer: true, expected: ["published"] },
    ];

    // Action
    const statuses = cases.map(({ tab, isEmployer }) => useProjectStatus(tab, isEmployer));

    // Assert
    expect(statuses).toEqual(cases.map(({ expected }) => expected));
  });
});
