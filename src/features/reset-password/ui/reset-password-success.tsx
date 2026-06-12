import { Button } from "@/shared/ui/button";
import {
  ModalBody,
  ModalDescription,
  ModalFooter,
  ModalTitle,
} from "@/shared/ui/modal/modal";
import { useEffect, useState } from "react";

const RESEND_TIMEOUT = 59;

type ResetPasswordSuccessProps = {
  email: string;
  onClose: () => void;
  onResend: () => void;
};

export function ResetPasswordSuccess({
  email,
  onClose,
  onResend,
}: ResetPasswordSuccessProps) {
  const [countdown, setCountdown] = useState(RESEND_TIMEOUT);

  useEffect(() => {
    if (countdown === 0) return;
    const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  function handleResendRequest() {
    onResend();
    setCountdown(RESEND_TIMEOUT);
  }

  return (
    <>
      <ModalTitle className="pb-4 text-[20px] leading-[130%] sm:pb-6 sm:text-4xl">
        Письмо отправлено!
      </ModalTitle>
      <ModalBody>
        <ModalDescription className="text-base leading-normal text-foreground sm:text-lg">
          Мы отправили инструкции на почту{" "}
          <span className="font-semibold">{email}</span>. Если письма нет,
          проверьте папку «Спам»
        </ModalDescription>
      </ModalBody>
      <ModalFooter className="flex-col gap-3 pt-4 sm:flex-col sm:gap-4 sm:pt-6">
        <Button
          type="button"
          onClick={onClose}
          className="h-12 w-full rounded-2xl text-base font-semibold sm:h-13.25 sm:text-lg"
        >
          Понятно
        </Button>
        {countdown > 0 ? (
          <p className="text-center text-sm text-foreground">
            Отправить повторно через {countdown} сек
          </p>
        ) : (
          <Button
            type="button"
            variant="link"
            onClick={handleResendRequest}
            className="h-auto p-0 text-sm text-foreground"
          >
            Отправить повторно
          </Button>
        )}
      </ModalFooter>
    </>
  );
}
