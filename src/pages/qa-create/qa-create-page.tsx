import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { Icon } from "@iconify/react";

import { createQuestion } from "@/entities/question";
import { ROUTES } from "@/shared/model/routes";
import { PageContainer } from "@/shared/ui/page-container";
import { CreateQuestionForm } from "@/widgets/create-question-form";

function QaCreatePage() {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const createMutation = useMutation({
    mutationFn: createQuestion,
    onSuccess: () => {
      toast.success("Вопрос опубликован");
      navigate(ROUTES.QA, { replace: true });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return (
    <PageContainer className="py-8 max-md:px-4 md:py-10">
      <div className="md:grid md:grid-cols-[1fr_minmax(0,736px)_1fr] md:items-start md:gap-6">
        <button
          type="button"
          onClick={goBack}
          className="hidden cursor-pointer items-center gap-2 text-base font-semibold text-foreground transition-colors hover:text-primary md:col-start-1 md:row-start-1 md:flex md:justify-self-start md:pt-1"
        >
          <Icon icon="ph:arrow-left" className="size-6" />
          Назад
        </button>

        <div className="w-full md:col-start-2 md:row-start-1">
          <div className="mb-5 flex items-center gap-2">
            <button
              type="button"
              onClick={goBack}
              aria-label="Назад"
              className="shrink-0 cursor-pointer text-foreground transition-colors hover:text-primary md:hidden"
            >
              <Icon icon="ph:arrow-left" className="size-6" />
            </button>
            <h1 className="text-[26px] leading-8 font-bold text-foreground md:text-[36px] md:leading-[1.3] md:font-semibold">
              Создание вопроса
            </h1>
          </div>

          <CreateQuestionForm
            isSubmitting={createMutation.isPending}
            onSubmit={({ anonymous, ...values }) => {
              createMutation.mutate({
                title: values.title,
                description: values.details,
                tags: values.tags,
                is_anonymous: anonymous,
              });
            }}
          />
        </div>
      </div>
    </PageContainer>
  );
}

export const Component = QaCreatePage;
