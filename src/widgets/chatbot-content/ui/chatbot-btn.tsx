import { Button } from "@/shared/ui/button";

type TChatbotBtn = {
  buttonTitle?: string;
  buttonText?: string;
  onButtonClick?: () => void;
};

export function ChatbotBtn({
  buttonTitle = "Не знаешь, с чего начать?",
  buttonText = "Авторизоваться",
  onButtonClick,
}: TChatbotBtn) {
  return (
    <div className="flex flex-col items-center justify-center pt-6 pb-8 pr-8">
      <h2 className="text-center text-[26px] font-bold">
        {buttonTitle}
      </h2>

      <Button
        type="button"
        onClick={onButtonClick}
        className="mt-6 rounded-[var(--radius-lg)] px-[136px] py-4 text-[18px] font-semibold"
      >
        {buttonText}
      </Button>
    </div>
  );
}