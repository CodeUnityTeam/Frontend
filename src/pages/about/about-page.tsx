import { useIsAuthed } from "@/shared/lib/auth";
import { Banner, Description, JoinUs } from "@/widgets/about";
import { ReviewsSection } from "@/widgets/reviews-section";
import { SupportSection } from "@/widgets/support-section";

function AboutPage() {
  const isAuthed = useIsAuthed();

  return (
    <>
      <Banner />
      <Description />
      {!isAuthed && <ReviewsSection />}
      <SupportSection />
      {!isAuthed && <JoinUs />}
    </>
  );
}

export const Component = AboutPage;
