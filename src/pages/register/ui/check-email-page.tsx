import { useState, type FormEvent } from "react";
import { Icon } from "@iconify/react";
import { Link, useLocation, useNavigate } from "react-router";

import { verifyEmail } from "@/shared/api/auth";
import { ROUTES } from "@/shared/model/routes";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { PageContainer } from "@/shared/ui/page-container";
import { openAuthLogin } from "@/widgets/registration/model/auth-modal-actions";

type ManualVerifyStatus = "idle" | "loading" | "success" | "error";

type CheckEmailLocationState = {
  prefill?: {
    name?: string;
    surname?: string;
    email?: string;
  };
};

function CheckEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const prefill = (location.state as CheckEmailLocationState | undefined)
    ?.prefill;
  const email = prefill?.email?.trim();
  const emailLabel = email || "адрес, указанный при регистрации";
  const [manualKey, setManualKey] = useState("");
  const [manualStatus, setManualStatus] = useState<ManualVerifyStatus>("idle");
  const [manualMessage, setManualMessage] = useState<string>("");
  const hasPrefillEmail = Boolean(email);

  const handleContinue = () => {
    if (hasPrefillEmail) {
      navigate(ROUTES.REGISTER, {
        state: {
          prefill,
        },
      });
      return;
    }

    openAuthLogin();
  };

  const handleManualSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const key = manualKey.trim();
    if (!key) {
      setManualStatus("error");
      setManualMessage("Введите ключ из письма.");
      return;
    }

    setManualStatus("loading");
    setManualMessage("Подтверждаем email, пожалуйста подождите.");

    try {
      const data = await verifyEmail({ key });

      if (typeof data === "object" && data !== null && "detail" in data) {
        const detail = (data as { detail?: unknown }).detail;
        if (typeof detail === "string" && detail.trim()) {
          setManualMessage(detail);
        } else {
          setManualMessage(
            "Email подтвержден. Теперь можно войти и продолжить.",
          );
        }
      } else {
        setManualMessage("Email подтвержден. Теперь можно войти и продолжить.");
      }

      setManualStatus("success");
    } catch (error) {
      const status =
        typeof error === "object" && error !== null && "status" in error
          ? (error as { status?: number }).status
          : undefined;
      const data =
        typeof error === "object" && error !== null && "data" in error
          ? (error as { data?: unknown }).data
          : undefined;

      if (status === 404) {
        setManualMessage(
          "Ссылка подтверждения устарела или уже использована. Запросите новое письмо.",
        );
      } else if (status === 400 && typeof data === "object" && data !== null) {
        const values = Object.values(data).flat();
        const firstMessage = values.find((item) => typeof item === "string");
        setManualMessage(
          typeof firstMessage === "string" && firstMessage.trim()
            ? firstMessage
            : "Ссылка подтверждения не прошла проверку.",
        );
      } else {
        setManualMessage("Не удалось подтвердить email. Попробуйте еще раз.");
      }

      setManualStatus("error");
    }
  };

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
            <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Icon icon="ph:envelope-simple-open" className="size-7" />
            </div>

            <div className="space-y-2">
              <CardTitle className="text-[26px] leading-[1.2] font-semibold md:text-[38px]">
                Проверьте почту
              </CardTitle>
              <CardDescription className="text-base leading-6 md:text-lg">
                Мы отправили письмо с подтверждением на{" "}
                <span className="font-medium text-foreground">
                  {emailLabel}
                </span>
                . Откройте письмо, перейдите по ссылке и потом войдите в
                аккаунт.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 md:p-8 md:pt-0">
            <div className="rounded-2xl border border-dashed border-border/70 bg-muted/30 p-4 md:p-5">
              <p className="text-sm font-medium text-foreground">
                Что нужно сделать дальше
              </p>
              <ol className="mt-3 space-y-3 text-sm leading-6 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    1
                  </span>
                  <span>Откройте письмо от CodeUnityTeam.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    2
                  </span>
                  <span>Нажмите на ссылку подтверждения email.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    3
                  </span>
                  <span>
                    После подтверждения вернитесь и войдите в систему.
                  </span>
                </li>
              </ol>
            </div>

            <p className="text-sm leading-6 text-muted-foreground">
              Этот шаг нужен только для регистрации по e-mail. Если вы входите
              через Yandex, Gmail или другой OAuth-провайдер, подтверждение
              письма не требуется.
            </p>

            <form
              onSubmit={handleManualSubmit}
              className="space-y-4 rounded-2xl border border-border/70 bg-background p-4 md:p-5"
            >
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-foreground">
                  Ввести ключ вручную
                </h2>
                <p className="text-sm leading-6 text-foreground/70">
                  Вставьте ключ из письма, если ссылка не открывается.
                </p>
              </div>

              <Input
                label="Ключ подтверждения"
                placeholder="Вставьте ключ из письма"
                value={manualKey}
                onChange={(event) => {
                  setManualKey(event.target.value);
                  if (manualStatus !== "idle") {
                    setManualStatus("idle");
                    setManualMessage("");
                  }
                }}
                error={manualStatus === "error" ? manualMessage : undefined}
                className="h-12 rounded-lg"
              />

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="submit"
                  className="w-full sm:order-2 sm:w-auto"
                  disabled={manualStatus === "loading"}
                >
                  {manualStatus === "loading"
                    ? "Проверяем..."
                    : "Подтвердить email"}
                </Button>

                {manualStatus === "success" && (
                <Button
                  type="button"
                  className="w-full sm:order-1 sm:w-auto"
                  onClick={handleContinue}
                >
                  {hasPrefillEmail ? "Продолжить" : "Войти и продолжить"}
                </Button>
              )}
              </div>

              {manualStatus === "success" && (
                <p className="text-sm leading-6 text-emerald-600">
                  {manualMessage}
                </p>
              )}

              {manualStatus === "loading" && (
                <p className="text-sm leading-6 text-muted-foreground">
                  {manualMessage}
                </p>
              )}
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 md:flex-row md:justify-between md:p-8 md:pt-0">
            <Button asChild variant="outline" className="w-full md:w-auto">
              <Link to={ROUTES.HOME}>На главную</Link>
            </Button>
          </CardFooter>
        </Card>
      </section>
    </PageContainer>
  );
}

export const Component = CheckEmailPage;
