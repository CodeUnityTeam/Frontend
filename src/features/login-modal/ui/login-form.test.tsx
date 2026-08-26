import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { forwardRef } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/render-with-providers";
import { useLogin } from "@/entities/auth";
import { LoginForm } from "./login-form";

const mutate = vi.fn();

vi.mock("@/entities/auth", () => ({ useLogin: vi.fn() }));
vi.mock("@/shared/ui/icon", () => ({ Icon: () => null }));
vi.mock("@/shared/ui/button", () => ({ Button: (props: React.ComponentProps<"button">) => <button {...props} /> }));
vi.mock("@/shared/ui/input", () => ({
  Input: forwardRef<HTMLInputElement, React.ComponentProps<"input"> & { label: string; error?: string; rightElement?: React.ReactNode }>(({ label, error, rightElement, ...props }, ref) => <label>{label}<input ref={ref} {...props} />{rightElement}{error && <span>{error}</span>}</label>),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useLogin).mockReturnValue({ mutate, isPending: false, error: null } as never);
  });

  it("validates fields before delegating valid credentials and forwards success", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    renderWithProviders(<LoginForm onSuccess={onSuccess} onOpenRegister={vi.fn()} />);

    // Invalid-submission feedback
    await user.click(screen.getByRole("button", { name: "Войти" }));
    expect(await screen.findByText("Введите E-mail")).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();

    // Valid submission
    await user.type(screen.getByPlaceholderText("Введите E-mail"), "user@example.com");
    await user.type(screen.getByPlaceholderText("Введите пароль"), "secret");
    await user.click(screen.getByRole("button", { name: "Войти" }));
    expect(mutate).toHaveBeenCalledWith({ email: "user@example.com", password: "secret" }, { onSuccess });
  });

  it("shows server failure, disables pending submission, toggles password, and opens registration", async () => {
    const user = userEvent.setup();
    const onOpenRegister = vi.fn();
    vi.mocked(useLogin).mockReturnValue({ mutate, isPending: true, error: new Error("Неверные данные") } as never);
    renderWithProviders(<LoginForm onSuccess={vi.fn()} onOpenRegister={onOpenRegister} />);

    // Pending-state and error feedback
    expect(screen.getByRole("alert")).toHaveTextContent("Неверные данные");
    expect(screen.getByRole("button", { name: "Вход…" })).toBeDisabled();
    expect(screen.getByPlaceholderText("Введите пароль")).toHaveAttribute("type", "password");
    // Password visibility toggle
    await user.click(screen.getByRole("button", { name: "Показать пароль" }));
    expect(screen.getByPlaceholderText("Введите пароль")).toHaveAttribute("type", "text");
    // Registration handoff
    await user.click(screen.getByRole("button", { name: "Регистрация" }));
    expect(onOpenRegister).toHaveBeenCalledOnce();
  });
});
