import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui/carousel";
import { ReviewCard, useReviews } from "@/entities/review";
import type { Review as ApiReview } from "@/shared/api/reviews";
import type { Review as UIReview } from "@/entities/review/model/types";

function mapApiReviewToReview(apiReview: ApiReview): UIReview {
  return {
    id: apiReview.review_id,
    author: {
      name: apiReview.author_name,
      profession: apiReview.author_specializations?.[0]?.name || "Специалист",
      avatarUrl: apiReview.author_avatar || "",
    },
    text: apiReview.text,
  };
}


export function ReviewsSection() {
  const { data: apiReviews, isLoading, isError } = useReviews();

  if (isLoading) {
    return (
      <section className="py-5">
        <div className="container mx-auto max-w-[1120px] px-4 lg:px-0">
          <h2 className="mb-7 text-[32px] leading-[1.3] font-semibold md:mb-6 md:text-4xl">
            Что о нас говорят?
          </h2>
          <div className="flex justify-center py-10">
            <p className="text-muted-foreground">Загрузка отзывов...</p>
          </div>
        </div>
      </section>
    );
  }

  if (isError || !apiReviews || apiReviews.length === 0) {
    return null;
  }

  const reviews = apiReviews.map(mapApiReviewToReview);

  return (
    <section className="py-5">
      <div className="container mx-auto max-w-[1120px] px-4 lg:px-0">
        <h2 className="mb-7 text-[32px] leading-[1.3] font-semibold md:mb-6 md:text-4xl">
          Что о нас говорят?
        </h2>
        <Carousel className="mx-auto max-w-[77%] md:max-w-[90%] xl:max-w-full">
          <CarouselContent className="-ml-4 md:-ml-9">
            {reviews.map((review) => (
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
