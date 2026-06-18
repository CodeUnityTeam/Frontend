import { useNavigate } from "react-router";
import Error404 from "@/shared/assets/icons/404.svg";

import { ROUTES } from "@/shared/model/routes";
import { Button } from "@/shared/ui/button";
import { PageContainer } from "@/shared/ui/page-container/page-container";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <PageContainer className="py-8">
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex w-full max-w-[640px] flex-col items-center text-center">
          <img
            src={Error404}
            alt="404"
            className="mb-8 h-[240px] w-[240px]"
          />

          <h1 className="mb-4 text-[48px] font-semibold">
            Такой страницы нет
          </h1>

          <p className="mb-8 text-lg text-muted-foreground">
            Возможно, адрес указан неверно, страница была удалена
            <br />
            или перенесена в другое место.
          </p>

          <div className="flex w-full max-w-[440px] flex-col gap-3">
            <Button
              className="w-full"
              onClick={() => navigate(ROUTES.HOME)}
            >
              На главную
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                if (window.history.length > 2) {
                  navigate(-2);
                } else {
                  navigate(ROUTES.HOME);
                }
              }}
            >
              Назад
            </Button>
          </div>

          <div className="mt-8 text-lg text-muted-foreground">
            Код ошибки: 404
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

export const Component = NotFoundPage;