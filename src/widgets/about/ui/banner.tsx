import { Button } from "@/shared/ui/button";

const isAuth = true;

export function Banner() {
  return (
    <section
      className={`px-4 md:px-20 md:mx-20 ${isAuth ? "py-[46.5px] md:pbs-20 md:pbe-[56px]" : "py-[36.5px] md:py-[74.5px]"} rounded-2xl bg-[url('@/shared/assets/images/greetingText.png')] bg-cover bg-center font-['Raleway']`}
    >
      <div className="max-w-600">
        <span className="text-xl font-semibold text-[var(--focused)] uppercase">
          Привет!
        </span>
        <h1 className="text-[54px] font-bold">Мы - CodeUnity</h1>
        <h2 className="text-[26px] font-bold md:text-[46px]">
          IT-форум для новичков
        </h2>
        <div
          className={`mbs-12 max-w-md text-lg md:font-semibold ${isAuth ? "leading-[1.3]" : "leading-[1.5]"}`}
        >
          <p className="mbe-4">
            Здесь можно быстро найти проекты и команды, задать вопрос сообществу
            и получить помощь.
          </p>
          <div>
            <span>Что мы делаем?</span>
            <ul className="list-disc">
              <li className="ms-7">Помогаем публиковать проекты и вакансии.</li>
              <li className="ms-7">Объединяем команды и участников.</li>
              <li className="ms-7">Поддерживаем живую Q&A‑ленту.</li>
            </ul>
          </div>
        </div>
        {!isAuth ? (
          <Button onClick={() => alert("В разработке")} size="lg" className="mbs-10 w-full px-10 md:mbs-16 md:w-auto">
            Зарегистрироваться
          </Button>
        ) : null}
      </div>
    </section>
  );
}
