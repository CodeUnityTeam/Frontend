import { Banner, Description, JoinUs } from "@/widgets/about";
import { ReviewsSection } from "@/widgets/reviews-section";
import { SupportSection } from "@/widgets/support-section";

function AboutPage() {
  return (
    <>
      <Banner />
      <Description />
      <ReviewsSection />
      <SupportSection />
      <JoinUs />
    </>
  );
}

export const Component = AboutPage;
