import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const { custom, dismiss } = vi.hoisted(() => ({
  custom: vi.fn(),
  dismiss: vi.fn(),
}));

vi.mock("sonner", () => ({ toast: { custom, dismiss } }));

import { showThanksNotification } from "./thanks-notification";

describe("showThanksNotification", () => {
  it("configures a custom timed notification whose close control dismisses only its toast", async () => {
    // Init
    const user = userEvent.setup();
    custom.mockImplementation((renderToast) => render(renderToast("toast-42")));

    // Action
    showThanksNotification();
    await user.click(screen.getByRole("button"));

    // Assert
    expect(custom).toHaveBeenCalledWith(expect.any(Function), {
      duration: 5000,
      style: { borderRadius: "24px", overflow: "hidden" },
    });
    expect(screen.getByText(/Спасибо! Ваше обращение успешно отправлено/i)).toBeInTheDocument();
    expect(dismiss).toHaveBeenCalledWith("toast-42");
  });
});
