
import { ChatbotWrapper } from "@/widgets/chatbot-content/ui/chatbot-wrapper";

export function ChatbotCardsPage() {
  return (
    <section className="mx-auto w-full max-w-[1280px] ps-4 pe-0 py-6 md:pl-8 md:pr-0" 
    style={{ backgroundColor: 'var(--color-light-blue)',
      borderRadius: "var(--radius-3xl)",
     }}>
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
