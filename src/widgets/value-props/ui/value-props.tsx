import { valueProps } from "@/widgets/value-props/model/value-props-data";

export const ValueProps = () => {
  return (
    <section className="mx-auto my-15 max-w-7xl rounded-4xl bg-muted p-4 md:p-8">
      <h2 className="mb-4 text-[28px] leading-[130%] font-semibold text-foreground md:mb-6 md:text-[32px] lg:text-[36px]">
        Наши преимущества
      </h2>

      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-3 xl:grid-cols-3">
        {valueProps.map((item, index) => (
          <article
            key={item.title}
            className="flex min-h-103 flex-col justify-between rounded-[24px] border border-border bg-background px-6 py-8 md:min-h-105 xl:min-h-120.5"
          >

            <span className="text-right font-raleway text-[46px] leading-[110%] font-bold text-foreground [font-variant-numeric:lining-nums_proportional-nums]">
              {String(index + 1).padStart(2, "0")}
            </span>

            <div className="mt-6 space-y-3 md:space-y-4">
              <h3 className="font-raleway text-[26px] leading-[110%] font-bold whitespace-normal text-foreground md:text-[34px] xl:text-[46px]">
                {item.title}
              </h3>

              <p className="font-raleway text-[18px] leading-[150%] font-normal text-muted-foreground md:text-[16px] xl:text-[18px]">
                {item.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
