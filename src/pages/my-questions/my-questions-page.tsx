import { MyQuestionsCard } from "@/widgets/my-questions/ui/my-questions";
import { PageContainer } from "@/shared/ui/page-container";
import { useNavigate } from "react-router";
import { Icon } from "@iconify/react";

const mockQuestion = {
  id: "1",
  author: {
    name: "Анна",
    avatar: "https://i.pravatar.cc/100?img=32",
  },
  likes: 4,
  createdAt: "6 дней назад",
  title: `Как собрать портфолио, если нет коммерческого опыта, 
    но хочется попасть в реальные проекты?`,
  tags: [
    { id: "1", label: "Дизайн" },
    { id: "2", label: "Figma" },
  ],
  details: `Я начинающий разработчик и пока не работал в коммерческих командах. Учебные проекты есть, но 
            они выглядят слишком “учебными”, и я не уверен, что их стоит показывать.\n\n
            Как правильно собирать портфолио без реального опыта? Стоит ли участвовать в open-source или 
            лучше искать командные pet-проекты? Хочется получить опыт, который будет полезен для будущего 
            трудоустройства и не тратить время впустую.`,
};

export function MyQuestionsPage() {
  const navigate = useNavigate();
  const back = () => navigate(-1);

  return (
    <PageContainer className="pt-[60px] pb-[223px]">
      <div className="grid grid-cols-[180px_minmax(0,1fr)] gap-14">
        <aside className="pt-2">
          <button
            type="button"
            onClick={back}
            className="hidden cursor-pointer items-center gap-2 text-base font-semibold text-foreground transition-colors hover:text-primary md:col-start-1 md:row-start-1 md:flex md:justify-self-start md:pt-1"
          >
            <Icon icon="ph:arrow-left" className="size-6" />
            Назад
          </button>
        </aside>

        <section>
          <h1 className="text-[var(--color-black)} text-[36px] leading-[1.3] font-semibold">
            Мои вопросы
          </h1>

          <MyQuestionsCard question={mockQuestion} />
        </section>
      </div>
    </PageContainer>
  );
}

export const Component = MyQuestionsPage;
