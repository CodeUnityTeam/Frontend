import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { Button } from "../button";

interface ThanksNotificationProps {
  t: string | number; // id уведомления для закрытия
}

function ThanksNotification({ t }: ThanksNotificationProps) {
  return (
    <div className="relative flex justify-center rounded-2xl border border-border bg-background px-15 py-14 shadow-lg">
      <Button
        variant="ghost"
        onClick={() => toast.dismiss(t)}
        className="absolute top-14 right-8 size-8"
      >
        <Icon icon="ph:x" />
      </Button>

      <div className="flex flex-col gap-6">
        <h2 className="text-lg leading-[1.23] font-bold md:text-[26px]">
          Спасибо! Ваше обращение успешно отправлено команде CodeUnity.
        </h2>
        <p className="text-base leading-[1.5] md:text-[18px]">
          Мы рассмотрим его в ближайшее время и свяжемся с вами.
        </p>
      </div>
    </div>
  );
}

export const showThanksNotification = () => {
  toast.custom((t) => <ThanksNotification t={t} />, {
    duration: 5000,
    style: {
      borderRadius: "24px",
      overflow: "hidden",
      width: "min(696px, calc(100vw - 2rem))",
    },
  });
};
