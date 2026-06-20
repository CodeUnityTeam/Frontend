import { Button } from "@/shared/ui/button";
import { Field } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  ModalBody,
  ModalDescription,
  ModalFooter,
  ModalTitle,
} from "@/shared/ui/modal/modal";
import { type FormEvent, useState } from "react";

type Props = {
  onSubmit: (email: string) => void;
  onBack: () => void;
  isPending?: boolean;
};

export function ResetPasswordForm({ onSubmit, onBack, isPending }: Props) {
  const [email, setEmail] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(email);
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <ModalTitle className="text-[20px] leading-[130%] sm:text-4xl">
        Восстановление пароля
      </ModalTitle>
      <ModalBody className="overflow-visible">
        <ModalDescription className="mb-4 font-raleway text-base text-foreground sm:mb-6 sm:text-lg">
          Введите E-mail, указанный при регистрации. Мы отправим на него ссылку
          для сброса пароля
        </ModalDescription>
        <Field className="gap-1">
          <Label
            htmlFor="email"
            className="font-raleway text-base font-semibold sm:text-xl"
          >
            E-mail
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="example@yandex.ru"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-14 w-full p-4 font-raleway text-lg"
          />
        </Field>
      </ModalBody>
      <ModalFooter className="flex-col gap-3 pt-0 sm:flex-col sm:gap-5">
        <Button
          type="submit"
          disabled={isPending}
          className="h-12 w-full rounded-lg text-base sm:h-13.25 sm:text-base"
        >
          Отправить ссылку
        </Button>
        <Button
          type="button"
          variant="link"
          onClick={onBack}
          className="h-auto w-full p-0 text-sm text-foreground"
        >
          Вернуться ко входу
        </Button>
      </ModalFooter>
    </form>
  );
}
