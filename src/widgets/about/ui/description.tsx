import { Icon } from "@iconify/react";

function Header3({ text }: { text: string }) {
  return (
    <h3 className="mbe-4 md:mbe-6 text-4xl font-semibold">
      {text}
    </h3>
  );
}

function SectionWhy({ image, text }: { image: string, text: string }) {
  return (
    <div className="flex gap-2 md:gap-4 mbe-2">
      <Icon icon={image} height="24" />
      <p>
        {text}
      </p>
    </div>
  );
}

export function Description() {
  return (
    <section className="md:px-20 md:mx-20 py-20 px-4 bg-white font-['Raleway'] text-lg">
      <div className="md:w-1/2">
        <div className="mbe-6 md:mbe-8">
          <Header3 text="Для кого создан CodeUnity?" />
          <p className="leading-[2.0]">
            Для начинающих frontend, backend, fullstack и UI/UX специалистов, которые хотят учиться и работать над реальными задачами.
          </p>
        </div>
        <div>
          <Header3 text="Почему именно CodeUnity?" />
          <SectionWhy image={"mdi:lightning-bolt-outline"} text="Быстрый старт с телефона." />
          <SectionWhy image={"mdi:dialogue-outline"} text="Обмен контактами через Telegram и GitHub." />
          <SectionWhy image={"mdi:drop-check-outline"} text="Минимум функций - максимум пользы" />
        </div>
      </div>
    </section>
  )
}