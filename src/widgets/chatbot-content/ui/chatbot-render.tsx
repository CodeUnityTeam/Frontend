import type { TChatbotWrapperItem } from "@/entities/review/model/types";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/shared/ui/carousel";

type TChatbotRender = {
  items: TChatbotWrapperItem[];
  api?: (api: CarouselApi) => void
};

export function ChatbotRender({
  items,
  api
}: TChatbotRender) {
  return (
    <Carousel setApi={api}>
      <CarouselContent>
        {items.map((item) => (
          <CarouselItem key={item.id} className="basis-auto">
            {item.card}
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

/*export function ChatbotRender({
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
}*/