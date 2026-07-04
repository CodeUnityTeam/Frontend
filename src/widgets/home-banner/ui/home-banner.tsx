import { Link } from "react-router";

import { useIsAuthed } from "@/shared/lib/auth";
import { Button } from "@/shared/ui/button";
import { openAuthRegister } from "@/widgets/registration/model/auth-modal-actions";
import { AuthQuickActions } from "@/widgets/auth-quick-actions";

export function HomeBanner() {
  const isAuthed = useIsAuthed();

  return (
    <section className="mx-4 rounded-2xl bg-[url('@/shared/assets/images/greetingText.png')] bg-cover bg-center px-4 pt-20 pb-5 md:mx-20 md:px-15 md:py-40">
      <div className="max-w-full md:max-w-152">
        <h1 className="text-[26px] leading-[1.1] font-bold md:text-[46px]">
          Код Юнити — твой первый проект начинается здесь!
        </h1>
        <p className="mbs-6 text-lg">
          Публикуй проекты, задавай вопросы и находи команду в нашем дружелюбном
          IT-сообществе для новичков.
        </p>
        {isAuthed ? (
          <AuthQuickActions className="mbs-10 md:mbs-16" />
        ) : (
          <div className="mbs-10 flex flex-col gap-5 md:mbs-16 md:flex-row md:gap-6">
            <Button
              onClick={openAuthRegister}
              size="lg"
              className="w-full px-10"
            >
              Зарегистрироваться
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full px-10">
              <Link to="/about">Узнать о нас</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
