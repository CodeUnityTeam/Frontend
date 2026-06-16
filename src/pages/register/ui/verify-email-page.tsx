import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Link, useParams } from "react-router";

import { verifyEmail } from "@/shared/api/auth";
import { ROUTES } from "@/shared/model/routes";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { PageContainer } from "@/shared/ui/page-container";
import {
  openAuthLogin,
  openAuthRegister,
} from "@/widgets/registration/model/auth-modal-actions";

type VerifyStatus = "loading" | "success" | "error";

function getMessageFromData(data: unknown, fallback: string): string {
  if (typeof data !== "object" || data === null) {
    return fallback;
  }

  if ("detail" in data) {
    const detail = (data as { detail?: unknown }).detail;
    if (typeof detail === "string" && detail.trim()) {
      return detail;
    }
  }

  const values = Object.values(data).flat();
  const firstMessage = values.find((item) => typeof item === "string");
  if (typeof firstMessage === "string" && firstMessage.trim()) {
    return firstMessage;
  }

  return fallback;
}

function getErrorMessage(error: unknown): string {
  if (typeof error !== "object" || error === null) {
    return "Не удалось подтвердить email. Попробуйте открыть ссылку еще раз.";
  }

  const status =
    "status" in error ? (error as { status?: number }).status : undefined;
  const data = "data" in error ? (error as { data?: unknown }).data : undefined;

  if (status === 404) {
    return "Ссылка подтверждения устарела или уже использована. Запросите новое письмо.";
  }

  if (status === 400 && data) {
    return getMessageFromData(
      data,
      "Ссылка подтверждения не прошла проверку. Попробуйте еще раз.",
    );
  }

  return getMessageFromData(
    data,
    "Не удалось подтвердить email. Попробуйте открыть ссылку еще раз.",
  );
}

function VerifyEmailPage() {
  const { key } = useParams();
  const [status, setStatus] = useState<VerifyStatus>("loading");
  const [message, setMessage] = useState<string>(
    "Подтверждаем email, пожалуйста подождите.",
  );

  useEffect(() => {
    if (!key) {
      setStatus("error");
      setMessage("Ссылка подтверждения не найдена.");
      return;
    }

    let cancelled = false;

    const run = async () => {
      setStatus("loading");
      setMessage("Подтверждаем email, пожалуйста подождите.");

      try {
        const data = await verifyEmail({ key });
        if (cancelled) {
          return;
        }

        setStatus("success");
        setMessage(
          getMessageFromData(
            data,
            "Email подтвержден. Теперь можно войти в аккаунт.",
          ),
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        setStatus("error");
        setMessage(getErrorMessage(error));
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [key]);

  const isLoading = status === "loading";
  const isSuccess = status === "success";

  const statusIcon = isLoading ? (
    <Icon icon="ph:spinner" className="size-7 animate-spin" />
  ) : isSuccess ? (
    <Icon icon="ph:check-circle" className="size-7" />
  ) : (
    <Icon icon="ph:warning-circle" className="size-7" />
  );

  const title = isLoading
    ? "Подтверждаем email"
    : isSuccess
      ? "Email подтвержден"
      : "Не удалось подтвердить email";

  return (
    <PageContainer className="flex flex-1 items-center justify-center py-6 md:py-14">
      <section className="relative w-full max-w-3xl">
        <div
          aria-hidden="true"
          className="absolute -top-16 right-8 size-40 rounded-full bg-primary/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-20 left-4 size-52 rounded-full bg-foreground/5 blur-3xl"
        />

        <Card className="relative overflow-hidden border-border/70 bg-background/90 shadow-lg backdrop-blur">
          <CardHeader className="space-y-4 pb-4 md:p-8 md:pb-4">
            <div
              className={`inline-flex size-14 items-center justify-center rounded-2xl ${
                isSuccess
                  ? "bg-emerald-500/10 text-emerald-600"
                  : isLoading
                    ? "bg-primary/10 text-primary"
                    : "bg-destructive/10 text-destructive"
              }`}
            >
              {statusIcon}
            </div>

            <div className="space-y-2">
              <CardTitle className="text-[26px] leading-[1.2] font-semibold md:text-[38px]">
                {title}
              </CardTitle>
              <CardDescription className="text-base leading-6 md:text-lg">
                {message}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-5 md:p-8 md:pt-0">
            {isSuccess ? (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm leading-6 text-muted-foreground">
                Теперь можно открыть вход и продолжить работу в системе.
              </div>
            ) : isLoading ? (
              <div className="rounded-2xl border border-border/70 bg-muted/30 p-4 text-sm leading-6 text-muted-foreground">
                Не закрывайте вкладку, пока мы проверяем ключ подтверждения.
              </div>
            ) : (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm leading-6 text-muted-foreground">
                Если письмо устарело или ссылка была открыта ранее, просто
                запросите новую регистрацию и повторите подтверждение.
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3 md:flex-row md:justify-between md:p-8 md:pt-0">
            {isSuccess ? (
              <>
                <Button className="w-full md:w-auto" onClick={openAuthLogin}>
                  Открыть вход
                </Button>
                <Button asChild variant="outline" className="w-full md:w-auto">
                  <Link to={ROUTES.HOME}>На главную</Link>
                </Button>
              </>
            ) : isLoading ? (
              <Button asChild variant="outline" className="w-full md:w-auto">
                <Link to={ROUTES.HOME}>На главную</Link>
              </Button>
            ) : (
              <>
                <Button className="w-full md:w-auto" onClick={openAuthRegister}>
                  Зарегистрироваться заново
                </Button>
                <Button asChild variant="outline" className="w-full md:w-auto">
                  <Link to={ROUTES.HOME}>На главную</Link>
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      </section>
    </PageContainer>
  );
}

export const Component = VerifyEmailPage;
