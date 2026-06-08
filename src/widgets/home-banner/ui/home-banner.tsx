import { Link } from "react-router";

import { Button } from "@/shared/ui/button";

export function HomeBanner() {
  return (
    <section
      className="px-4 mx-4 md:mx-20 md:px-15 pt-20 pb-5 md:py-40 rounded-2xl bg-[url('@/shared/assets/images/greetingText.png')] bg-cover bg-center"
    >
      <div className="md:max-w-152 max-w-full">
        <h1 className="text-[26px] font-bold md:text-[46px] leading-[1.1]">
          Код Юнити — твой первый проект начинается здесь!
        </h1>
        <p className="mbs-6 text-lg">
          Публикуй проекты, задавай вопросы и находи команду
          в нашем дружелюбном IT-сообществе для новичков.
        </p>
        <div className="mbs-10 flex flex-col gap-5 md:mbs-16 md:flex-row md:gap-6">
          <Button onClick={() => alert("В разработке")} size="lg" className="w-full px-10">
            Зарегистрироваться
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full px-10">
            <Link to="/about">Узнать о нас</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
