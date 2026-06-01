import { Banner, Description, JoinUs } from "@/widgets/about";
import { ReviewsSection } from "@/widgets/reviews-section";

function AboutPage() {
  return (
    <>
      <Banner />
      <Description />
      <ReviewsSection />
      <JoinUs />
    </>
  );
}

export const Component = AboutPage;
