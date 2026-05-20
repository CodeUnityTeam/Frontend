export const ValueProps = () => {
  const valueProps = [
    {
      title: 'Фокус на практике',
      description:
        'Новички получают доступ к реальным задачам и проектам, а не только к учебным материалам. Это решает главную боль: «Как применить знания?», «Где взять реальный опыт?»',
    },
    {
      title: 'Скорость поиска',
      description:
        'Создай профиль и найди команду за 2 минуты — прямо с телефона. Интерфейс оптимизирован под мобильные устройства, а гибкие фильтры делают поиск ещё проще.',
    },
    {
      title: 'Безопасное сообщество',
      description:
        'Здесь тебя не оценивают по уровням. Платформа построена как сообщество единомышленников, а не рынок труда: акцент на взаимопомощи, поддержке и командной работе.',
    },
  ];

  return (
    <section className="mx-auto my-15 max-w-7xl rounded-[32px] bg-[#F1F4F9] p-4 md:p-8">

      <h2 className="mb-4 md:mb-6 text-[28px] md:text-[32px] lg:text-[36px] font-semibold leading-[130%] text-[#252728]">
        Наши преимущества
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5 md:gap-3">

        {valueProps.map((item, index) => (
          <article
            key={`${item.title}-${index}`}
            className="flex flex-col justify-between rounded-[24px] border border-[#9A9BA9] bg-[#FDFDFD] px-6 py-8 min-h-103 md:min-h-105 xl:min-h-120.5"
          >

            {/* number */}
            <span className="text-right font-raleway text-[46px] font-bold leading-[110%] text-[#252728] [font-variant-numeric:lining-nums_proportional-nums]">
              {String(index + 1).padStart(2, '0')}
            </span>

            {/* content */}
            <div className="mt-6 space-y-3 md:space-y-4">

              <h3 className="font-raleway font-bold text-[26px] md:text-[34px] xl:text-[46px] leading-[110%] text-[#252728] whitespace-normal">
                {item.title}
              </h3>

              <p className="font-raleway font-normal text-[18px] md:text-[16px] xl:text-[18px] leading-[150%] text-[#5f6368]">
                {item.description}
              </p>

            </div>

          </article>
        ))}

      </div>
    </section>
  );
};