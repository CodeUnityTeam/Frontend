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
    <div className="flex flex-col items-center justify-center pt-6 pr-8 pb-8">
      <h2 className="text-center text-[26px] font-bold">{buttonTitle}</h2>

      <Button
        type="button"
        onClick={onButtonClick}
        className="mt-6 w-full rounded-[var(--radius-lg)] py-4 text-[18px] font-semibold md:w-auto md:px-[136px]"
      >
        {buttonText}
      </Button>
    </div>
  );
}
