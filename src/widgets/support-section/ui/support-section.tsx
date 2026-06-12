import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { isAuth } from "@/shared/config/mock-config";
import { useModal } from "@/shared/lib/hooks";
import { FeedbackModal } from "@/features/feedback-modal";

export function SupportSection() {
  const { open, setOpen, openModal } = useModal(false);

  if (!isAuth) {
    return null;
  }

  return (
    <section className="mx-4 mb-[61px] sm:mx-20 sm:mb-[107px]">
      <Card className="flex flex-col rounded-3xl sm:gap-8 sm:px-20 sm:py-15">
        <CardHeader className="gap-4 px-4 py-8 sm:px-0 sm:py-0">
          <CardTitle className="m-0 leading-[130%] sm:text-4xl">
            Служба поддержки
          </CardTitle>
          <CardDescription className="leading-[100%] text-foreground sm:text-lg sm:leading-[150%]">
            Выберите удобный для вас способ связи, чтобы получить консультацию
            или сообщить о проблеме
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex-col gap-4 px-4 pb-[46px] sm:flex-row sm:gap-6 sm:px-0 sm:py-0">
          <Button
            onClick={openModal}
            variant="default"
            size="lg"
            className="w-[329px] px-0 sm:w-[291px]"
          >
            Форма обратной связи
          </Button>
          <Button
            onClick={() => alert("В разработке")}
            variant="outline"
            size="lg"
            className="w-[329px] px-0 sm:w-[291px]"
          >
            Связаться в Telegram
          </Button>
        </CardFooter>
      </Card>
      <FeedbackModal open={open} onOpenChange={setOpen} />
    </section>
  );
}
