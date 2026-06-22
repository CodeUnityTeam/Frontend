import { ChatbotWrapper } from "@/widgets/chatbot-content/ui/chatbot-wrapper";
import { openAuthLogin } from "@/widgets/registration/model/auth-modal-actions";

export function ChatbotCards() {
  return (
    <section
      className="mx-auto mt-15 w-full max-w-[1280px] py-6 ps-4 pe-0 md:pr-0 md:pl-8"
      style={{
        backgroundColor: "var(--color-light-blue)",
        borderRadius: "var(--radius-3xl)",
      }}
    >
      <ChatbotWrapper
        title="Не знаешь, с чего начать?"
        buttonText="Авторизоваться"
        onButtonClick={openAuthLogin}
      />
    </section>
  );
}

export const Component = ChatbotCards;
