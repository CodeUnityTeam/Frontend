import { HomeBanner } from "@/widgets/home-banner";
import { ValueProps } from "@/widgets/value-props";
import { ChatbotCards } from "@/widgets/chatbot-content";
import { ProjectModal } from "@/features/project-modal";
import { useState } from "react";

const HomePage = () => {
  const [open, setOpen] = useState(true);
  return (
    <>
    <ProjectModal
  open={open}
  onOpenChange={setOpen}
  mode="create"        
/>
      <HomeBanner />
      <ChatbotCards />
      <ValueProps />
    </>
  );
};

export const Component = HomePage;
