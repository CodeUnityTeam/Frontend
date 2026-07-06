import { useNavigate } from "react-router";

import { ROUTES } from "@/shared/model/routes";
import { useIsAuthed } from "@/shared/lib/auth";
import { ChatbotWrapper } from "@/widgets/chatbot-content/ui/chatbot-wrapper";
import { openAuthLogin } from "@/widgets/registration/model/auth-modal-actions";

export function ChatbotCards() {
  const navigate = useNavigate();
  const isAuthed = useIsAuthed();

  return (
    <section
      className="mx-auto mt-15 w-full max-w-[1280px] py-6 ps-4 pe-0 md:pr-0 md:pl-8"
      style={{
        backgroundColor: "var(--color-light-blue)",
        borderRadius: "var(--radius-3xl)",
      }}
    >
      <ChatbotWrapper
        title={isAuthed ? "Что дальше?" : "Не знаешь, с чего начать?"}
        buttonText={isAuthed ? "Q&A" : "Авторизоваться"}
        onButtonClick={isAuthed ? () => navigate(ROUTES.QA) : openAuthLogin}
      />
    </section>
  );
}

export const Component = ChatbotCards;
