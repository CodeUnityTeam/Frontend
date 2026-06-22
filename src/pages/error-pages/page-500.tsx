import Error500 from "@/shared/assets/icons/500.svg";

import { Button } from "@/shared/ui/button";
import { PageContainer } from "@/shared/ui/page-container/page-container";

function ServerErrorPage() {
  return (
    <PageContainer className="py-8">
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex w-full max-w-[640px] flex-col items-center text-center">
          <img
            src={Error500}
            alt="500"
            className="mb-8 h-[240px] w-[240px]"
          />

          <h1 className="mb-4 text-[48px] font-semibold">
            Что-то пошло не так
          </h1>

          <p className="mb-8 text-lg text-muted-foreground">
            Произошел сбой на сервере. Мы уже восстанавливаем работу.
            <br />
            Пожалуйста, попробуйте обновить страницу позже.
          </p>

          <div className="w-full max-w-[440px]">
            <Button
              className="w-full"
              onClick={() => window.location.reload()}
            >
              Обновить страницу
            </Button>
          </div>

          <div className="mt-8 text-lg text-muted-foreground">
            Код ошибки: 500
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

export const Component = ServerErrorPage;