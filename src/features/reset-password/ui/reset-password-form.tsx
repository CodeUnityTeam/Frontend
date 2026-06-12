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
  onClose: () => void;
  isPending?: boolean;
};

export function ResetPasswordForm({ onSubmit, onClose, isPending }: Props) {
  const [email, setEmail] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(email);
  }

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <ModalTitle className="pb-4 text-[20px] leading-[130%] sm:pb-6 sm:text-4xl">
        Восстановление пароля
      </ModalTitle>
      <ModalBody className="overflow-visible">
        <ModalDescription className="mb-4 text-base leading-normal text-foreground sm:mb-6 sm:text-lg">
          Введите E-mail, указанный при регистрации. Мы отправим на него ссылку
          для сброса пароля
        </ModalDescription>
        <Field className="gap-1">
          <Label htmlFor="email" className="text-base font-semibold sm:text-xl">
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
            className="w-full"
          />
        </Field>
      </ModalBody>
      <ModalFooter className="flex-col gap-3 pt-4 sm:flex-col sm:gap-4 sm:pt-6">
        <Button
          type="submit"
          disabled={isPending}
          className="h-12 w-full rounded-lg text-base font-semibold sm:h-13.25 sm:text-lg"
        >
          Отправить ссылку
        </Button>
        <Button
          type="button"
          variant="link"
          onClick={onClose}
          className="h-auto w-full p-0 text-sm text-foreground"
        >
          Вернуться ко входу
        </Button>
      </ModalFooter>
    </form>
  );
}
