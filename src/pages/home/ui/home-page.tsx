import { HomeBanner } from "@/widgets/home-banner";
import { ValueProps } from "@/widgets/value-props";
import { ChatbotCardsPage } from "@/pages/chatbot-cards/chatbot-cards";

const HomePage = () => {
  return (
    <>
      <HomeBanner />
      <ChatbotCardsPage />
      <ValueProps />
    </>
  );
};

export const Component = HomePage;
