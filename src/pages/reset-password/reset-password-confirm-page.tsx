import { useState } from "react";
import { Icon } from "@iconify/react";
import { Link, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  resetPasswordConfirmSchema,
  type ResetPasswordConfirmValues,
} from "@/features/reset-password/model/reset-password-confirm-schema";
import { useResetPasswordConfirm } from "@/features/reset-password/model/use-reset-confirm-mutation";
import { ROUTES } from "@/shared/model/routes";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { PageContainer } from "@/shared/ui/page-container";
import { toast } from "sonner";

type PageStatus = "form" | "error";

function ResetPasswordConfirmPage() {
  const { key } = useParams();
// TODO уточнить у бэка формат данных
  const idx = (key ?? "").indexOf("-");
  const uid = idx === -1 ? "" : key!.slice(0, idx);
  const token = idx === -1 ? (key ?? "") : key!.slice(idx + 1);

  const [pageStatus, setPageStatus] = useState<PageStatus>("form");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending } = useResetPasswordConfirm();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordConfirmValues>({
    resolver: zodResolver(resetPasswordConfirmSchema),
    mode: "onTouched",
  });

  const onSubmit = (values: ResetPasswordConfirmValues) => {
    mutate(
      { uid, token, new_password1: values.password, new_password2: values.password },
      {
        onSuccess: (data) => toast.success(data.detail),
        onError: (error) => {
          setErrorMessage(
            "Не удалось изменить пароль. Попробуйте запросить новую ссылку.",
          );
          setPageStatus("error");
          toast.error(error.message)
        },
      },
    );
  };

  if (pageStatus === "error") {
    return (
      <PageContainer className="flex flex-1 items-center justify-center py-6 md:py-14">
        <section className="w-full max-w-xl">
          <Card className="border-border/70 bg-background/90 shadow-lg">
            <CardHeader className="space-y-4 pb-4 md:p-8 md:pb-4">
              <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                <Icon icon="ph:warning-circle" className="size-7" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-[26px] leading-[1.2] font-semibold md:text-[38px]">
                  Не удалось изменить пароль
                </CardTitle>
                <CardDescription className="text-base leading-6 md:text-lg">
                  {errorMessage}
                </CardDescription>
              </div>
            </CardHeader>
            <CardFooter className="flex flex-col gap-3 md:flex-row md:p-8 md:pt-0">
              <Button
                variant="outline"
                className="w-full md:w-auto"
                onClick={() => setPageStatus("form")}
              >
                Попробовать снова
              </Button>
              <Button asChild variant="outline" className="w-full md:w-auto">
                <Link to={ROUTES.HOME}>На главную</Link>
              </Button>
            </CardFooter>
          </Card>
        </section>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="flex flex-1 items-center justify-center bg-light-blue py-6 md:py-14">
      <section className="flex w-full max-w-xl flex-col gap-6 rounded-lg bg-background px-13 py-12">
        <h1 className="text-4xl font-semibold">Новый пароль</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <Input
            {...register("password")}
            label="Введите новый пароль"
            placeholder="Пароль"
            type={showPassword ? "text" : "password"}
            className="h-14 rounded-lg"
            error={errors.password?.message}
            rightElement={
              <Button
                type="button"
                variant="ghost"
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                onClick={() => setShowPassword((v) => !v)}
                className="flex cursor-pointer text-gray transition-colors hover:text-foreground"
              >
                <Icon
                  icon={showPassword ? "ph:eye-slash" : "ph:eye"}
                  height={24}
                />
              </Button>
            }
          />
          <Button
            type="submit"
            size="lg"
            className="flex-1 rounded-lg text-[16px] font-normal"
            disabled={isPending}
          >
            {isPending ? "Сохраняем..." : "Сохранить и войти"}
          </Button>
        </form>
      </section>
    </PageContainer>
  );
}

export const Component = ResetPasswordConfirmPage;