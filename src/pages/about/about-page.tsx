import { Banner } from "@/widgets/about/ui/banner";
import { Description } from "@/widgets/about/ui/description";
import { ReviewsSection } from "@/widgets/reviews-section";

function AboutPage() {
  return (
    <>
      <Banner />
      <Description />
      <ReviewsSection />
    </>
  );
}

export const Component = AboutPage;
