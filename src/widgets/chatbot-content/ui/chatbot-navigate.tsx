import { Button } from "@/shared/ui/button";
import { Icon } from "@iconify/react";

type TChatbotNavigate = {
  onPrev?: () => void;
  onNext?: () => void;
};

export function ChatbotNavigate({ onPrev, onNext }: TChatbotNavigate) {
  return (
    <>
      <div className="flex items-center justify-end gap-3 pr-8">
        <Button
          type="button"
          size="icon_lg"
          variant="ghost"
          onClick={onPrev}
          className="rounded-2xl"
          style={{ background: "var(--color-light-gray-200)" }}
        >
          <Icon icon="ph:caret-left" className="text-xs" />
        </Button>

        <Button
          type="button"
          size="icon_lg"
          variant="outline"
          onClick={onNext}
          className="rounded-2xl border-1"
          style={{ background: "var(--color-white)" }}
        >
          <Icon icon="ph:caret-right" className="text-xl" />
        </Button>
      </div>
    </>
  );
}
