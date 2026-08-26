import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/render-with-providers";
import { useAuthModalStore } from "@/shared/store/auth-modal-store";
import { LoginModal } from "./login-modal";

const setRedirectPath = vi.fn();

vi.mock("@/shared/store/auth-modal-store", () => ({ useAuthModalStore: vi.fn() }));
vi.mock("@/shared/ui/modal/modal", () => ({ Modal: ({ children, open }: { children: React.ReactNode; open: boolean }) => open ? <div>{children}</div> : null }));
vi.mock("@/shared/ui/dialog", () => ({
  DialogClose: ({ children, ...props }: React.ComponentProps<"button">) => <button {...props}>{children}</button>,
  DialogDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
}));
vi.mock("@/shared/ui/icon", () => ({ Icon: () => null }));
vi.mock("@/shared/ui/button", () => ({ Button: (props: React.ComponentProps<"button">) => <button {...props} /> }));
vi.mock("./login-form", () => ({ LoginForm: ({ onSuccess, onOpenRegister }: { onSuccess: () => void; onOpenRegister: () => void }) => <><button onClick={onSuccess}>Login success</button><button onClick={onOpenRegister}>Open registration</button></> }));
vi.mock("./social-login", () => ({ SocialLogin: () => <div>Social login</div> }));

describe("LoginModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuthModalStore).mockReturnValue({ setRedirectPath } as never);
  });

  it("stores the current route and coordinates success, registration, reset, and close actions", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onOpenRegister = vi.fn();
    const onOpenResetPassword = vi.fn();
    renderWithProviders(<LoginModal open onOpenChange={onOpenChange} onOpenRegister={onOpenRegister} onOpenResetPassword={onOpenResetPassword} />, { withRouter: true, initialEntry: "/projects?tab=mine" });

    // Initial redirect-path capture
    expect(setRedirectPath).toHaveBeenCalledWith("/projects?tab=mine");

    // Login-success closure
    await user.click(screen.getByRole("button", { name: "Login success" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);

    // Registration handoff
    await user.click(screen.getByRole("button", { name: "Open registration" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onOpenRegister).toHaveBeenCalledOnce();
    // Password-reset handoff
    await user.click(screen.getByRole("button", { name: "Забыли пароль?" }));
    expect(onOpenResetPassword).toHaveBeenCalledOnce();
    // Explicit modal closure
    await user.click(screen.getByRole("button", { name: "Закрыть" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
