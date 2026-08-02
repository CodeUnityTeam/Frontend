import { useRouteError } from "react-router";
import { Button } from "@/shared/ui/button";
import { PageContainer } from "@/shared/ui/page-container/page-container";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: unknown }).message;
    return typeof message === "string" ? message : "";
  }

  return "";
}

function isChunkLoadError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase();

  return [
    "failed to fetch dynamically imported module",
    "importing a module script failed",
    "chunkloaderror",
    "loading chunk",
  ].some((pattern) => message.includes(pattern));
}

export function RouteErrorPage() {
  const error = useRouteError();
  const chunkLoadFailed = isChunkLoadError(error);

  return (
    <PageContainer className="py-8">
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex w-full max-w-[640px] flex-col items-center text-center">
          <h1 className="mb-4 text-[48px] font-semibold">
            {chunkLoadFailed
              ? "Не удалось загрузить страницу"
              : "Что-то пошло не так"}
          </h1>

          <p className="mb-8 text-lg text-muted-foreground">
            {chunkLoadFailed
              ? "Обновите страницу и попробуйте еще раз."
              : "Произошла ошибка при открытии страницы. Попробуйте обновить ее."}
          </p>

          <Button
            className="w-full max-w-[440px]"
            onClick={() => window.location.reload()}
          >
            Обновить страницу
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
