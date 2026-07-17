import { useIsAuthed } from "@/shared/lib/auth";
import { Banner, Description, JoinUs } from "@/widgets/about";
import { ReviewsSection } from "@/widgets/reviews-section";
import { SupportSection } from "@/widgets/support-section";

function AboutPage() {
  const isAuthed = useIsAuthed();

  return (
    <>
      <Banner isAuthed={isAuthed} />
      <Description />
      <ReviewsSection isAuthed={isAuthed} />
      <SupportSection isAuthed={isAuthed} />
      <JoinUs isAuthed={isAuthed} />
    </>
  );
}

export const Component = AboutPage;
