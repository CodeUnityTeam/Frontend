import { HomeBanner } from "@/widgets/home-banner";
import { ValueProps } from "@/widgets/value-props";
import { ChatbotCards } from "@/widgets/chatbot-content";


const HomePage = () => {
  return (
    <>
      <HomeBanner />
      
      <ChatbotCards />
      <ValueProps />
    </>
  );
};

export const Component = HomePage;
