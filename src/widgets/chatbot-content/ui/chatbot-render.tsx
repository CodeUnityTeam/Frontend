import type { TChatbotWrapperItem } from "@/entities/review/model/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/shared/ui/carousel";

type TChatbotRender = {
  items: TChatbotWrapperItem[];
  api?: (api: CarouselApi) => void;
};

export function ChatbotRender({ items, api }: TChatbotRender) {
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
