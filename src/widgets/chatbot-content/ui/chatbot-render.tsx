import type { TChatbotWrapperItem } from "@/entities/review/model/types";

type TChatbotRender = {
  items: TChatbotWrapperItem[];
};

export function ChatbotRender({
  items,
}: TChatbotRender) {
  return (
    <div className="overflow-hidden">
      <div className="flex gap-3">
        {items.map((item) => (
          <div key={item.id} className="shrink-0">
            {item.card}
          </div>
        ))}
      </div>
    </div>
  );
}