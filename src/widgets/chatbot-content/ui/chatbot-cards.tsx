import { ChatbotWrapper } from "@/widgets/chatbot-content/ui/chatbot-wrapper";

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
        onPrev={() => console.log("prev")}
        onNext={() => console.log("next")}
        title="Не знаешь, с чего начать?"
        buttonText="Авторизоваться"
        onButtonClick={() => alert("в разработке")}
      />
    </section>
  );
}

export const Component = ChatbotCards;
