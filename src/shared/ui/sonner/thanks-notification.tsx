import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { Button } from "../button";

interface ThanksNotificationProps {
  t: string | number; // id уведомления для закрытия
}

function ThanksNotification({ t }: ThanksNotificationProps) {
  return (
    <div className="relative flex justify-start rounded-2xl border border-border bg-background px-4 py-6 shadow-lg md:w-[696px] md:px-15 md:py-14">
      <Button
        variant="ghost"
        onClick={() => toast.dismiss(t)}
        className="absolute top-6 right-4 size-8 md:top-14 md:right-8"
      >
        <Icon icon="ph:x" />
      </Button>

      <div className="flex w-[92%] flex-col gap-6">
        <h2 className="text-lg leading-[1.3] font-bold md:text-[26px]">
          Спасибо! Ваше обращение успешно отправлено команде CodeUnity.
        </h2>
        <p className="text-lg leading-[1.5] md:text-[18px]">
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
    },
  });
};
