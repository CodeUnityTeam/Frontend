import { HomeBanner } from "@/widgets/home-banner";
import { ValueProps } from "@/widgets/value-props";
import { ChatbotCards } from "@/widgets/chatbot-content";
// import { ProjectModal } from "@/features/project-modal";

const HomePage = () => {
  return (
    <>
    {/* <ProjectModal
  open={true}
  onOpenChange={(()=>{})}
  mode="create"        
/> */}
      <HomeBanner />
      <ChatbotCards />
      <ValueProps />
    </>
  );
};

export const Component = HomePage;
