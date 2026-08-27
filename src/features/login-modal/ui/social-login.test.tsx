import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/render-with-providers";
import { useMailRuAuthUrl, useYandexAuthUrl } from "@/entities/auth";
import { SocialLogin } from "./social-login";

const yandexMutate = vi.fn();
const mailRuMutate = vi.fn();

vi.mock("@/entities/auth", () => ({ useYandexAuthUrl: vi.fn(), useMailRuAuthUrl: vi.fn() }));
vi.mock("@/shared/ui/icon", () => ({ Icon: () => null }));
vi.mock("@/shared/ui/button", () => ({ Button: (props: React.ComponentProps<"button">) => <button {...props} /> }));

describe("SocialLogin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useYandexAuthUrl).mockReturnValue({ mutate: yandexMutate, isPending: false } as never);
    vi.mocked(useMailRuAuthUrl).mockReturnValue({ mutate: mailRuMutate, isPending: false } as never);
  });

  it("delegates each provider login action", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SocialLogin />);
    await user.click(screen.getByRole("button", { name: "Войти через Яндекс" }));
    await user.click(screen.getByRole("button", { name: "Войти через Mail.ru" }));
    expect(yandexMutate).toHaveBeenCalledOnce();
    expect(mailRuMutate).toHaveBeenCalledOnce();
  });

  it("disables only the provider request currently in flight", () => {
    vi.mocked(useYandexAuthUrl).mockReturnValue({ mutate: yandexMutate, isPending: true } as never);
    renderWithProviders(<SocialLogin />);
    expect(screen.getByRole("button", { name: "Войти через Яндекс" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Войти через Mail.ru" })).toBeEnabled();
  });
});
