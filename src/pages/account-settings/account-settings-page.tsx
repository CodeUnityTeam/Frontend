import type { FormEvent } from "react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { PageContainer } from "@/shared/ui/page-container";

function AccountSettingsPage() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    alert("в разработке");
  }

  function handleDeleteAccount() {
    alert("в разработке");
  }

  return (
    <PageContainer className="flex flex-1 items-center justify-center py-5 md:py-16">
      <section
        className="w-full max-w-152 rounded-xl border border-(--color-light-gray-200)"
        aria-labelledby="account-settings-title"
      >
        <div className="flex flex-col space-y-1.5 p-6 pb-0 md:p-8 md:pt-6 md:pb-0">
          <h1
            id="account-settings-title"
            className="text-[26px] leading-[1.3] font-semibold md:text-[36px]"
          >
            Настройка аккаунта
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:gap-6 gap-3 p-6 md:p-8 md:pt-6">
            <div className="flex flex-col gap-5 md:gap-6">
              <Input
                label="E-mail"
                name="email"
                type="email"
                placeholder="anna123@yandex.ru"
                autoComplete="email"
              />
              <Input
                label="Пароль"
                name="password"
                type="password"
                placeholder="••••••••••"
                autoComplete="current-password"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Button
                className="w-fit self-start"
                type="button"
                variant="ghost"
                onClick={handleDeleteAccount}
              >
                Удалить аккаунт
              </Button>
              <Button className="w-full sm:w-auto" type="submit">
                Сохранить
              </Button>
            </div>
          </div>
        </form>
      </section>
    </PageContainer>
  );
}

export const Component = AccountSettingsPage;
