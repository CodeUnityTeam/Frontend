import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui/carousel";
import { REVIEWS_MOCKS } from "@/entities/review/model/mocks";
import { ReviewCard } from "@/entities/review";

export function ReviewsSection() {
  const isAuth = false;

  if (isAuth) {
    return null;
  }

  return (
    <section className="py-10 md:py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-7 text-[32px] leading-[1.3] font-semibold md:mb-6 md:text-4xl">
          Что о нас говорят?
        </h2>
        <Carousel className="mx-auto max-w-[77%] md:max-w-full">
          <CarouselContent className="-ml-4 md:-ml-9">
            {REVIEWS_MOCKS.map((review) => (
              <CarouselItem
                key={review.id}
                className="pl-4 md:basis-1/2 md:pl-9"
              >
                <ReviewCard author={review.author} text={review.text} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
