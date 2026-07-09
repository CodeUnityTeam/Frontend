import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { deleteQuestion, getQuestion, updateQuestion } from "@/entities/question";
import type { QuestionFormValues } from "@/entities/question";
import { ConfirmModal } from "@/features/confirm-modal";
import { useSkills } from "@/entities/skill";
import { ROUTES } from "@/shared/model/routes";
import { PageContainer } from "@/shared/ui/page-container";
import { QuestionForm } from "@/widgets/question-form";

function QaEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const goBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
      return;
    }

    navigate(ROUTES.QA, { replace: true });
  };
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  const questionId = id ?? "";
  const questionQuery = useQuery({
    queryKey: ["question-details", questionId],
    queryFn: () => getQuestion(questionId),
    enabled: Boolean(questionId),
  });
  const skillsQuery = useSkills();

  const updateMutation = useMutation({
    mutationFn: (values: QuestionFormValues) =>
      updateQuestion(questionId, {
        title: values.title,
        description: values.details,
        tags: values.tags,
      }),
    onSuccess: () => {
      toast.success("Вопрос сохранён");
      navigate(ROUTES.QA, { replace: true });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteQuestion(questionId),
    onSuccess: () => {
      setDeleteOpen(false);
      toast.success("Вопрос удалён");
      navigate(ROUTES.QA, { replace: true });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (values: QuestionFormValues) => {
    updateMutation.mutate(values);
  };

  const confirmDelete = () => {
    deleteMutation.mutate();
  };

  if (questionQuery.isPending || skillsQuery.isPending) {
    return (
      <PageContainer className="py-8 max-md:px-4 md:py-10">
        <div className="flex min-h-[40vh] items-center justify-center">
          <p className="text-base text-foreground">Загрузка вопроса...</p>
        </div>
      </PageContainer>
    );
  }

  if (questionQuery.error || skillsQuery.error || !questionQuery.data || !skillsQuery.data) {
    return (
      <PageContainer className="py-8 max-md:px-4 md:py-10">
        <div className="flex min-h-[40vh] items-center justify-center">
          <p className="text-base text-foreground">
            Не удалось загрузить вопрос.
          </p>
        </div>
      </PageContainer>
    );
  }

  const skillIdByName = new Map(
    skillsQuery.data.map((skill) => [skill.name, skill.skillId]),
  );
  const initialTags = questionQuery.data.tags
    .map((tagName) => skillIdByName.get(tagName))
    .filter((skillId): skillId is string => Boolean(skillId));

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
          <div className="mb-5 flex items-center gap-2 md:mb-[43px]">
            <button
              type="button"
              onClick={goBack}
              aria-label="Назад"
              className="shrink-0 cursor-pointer text-foreground transition-colors hover:text-primary md:hidden"
            >
              <Icon icon="ph:arrow-left" className="size-6" />
            </button>
            <h1 className="text-[26px] leading-8 font-bold text-foreground md:text-[36px] md:leading-[1.3] md:font-semibold">
              Редактирование вопроса
            </h1>
          </div>

          <QuestionForm
            initialValues={{
              title: questionQuery.data.title,
              details: questionQuery.data.description,
              tags: initialTags,
            }}
            onSubmit={handleSubmit}
            onDelete={() => setDeleteOpen(true)}
            isSubmitting={updateMutation.isPending || deleteMutation.isPending}
          />

          <ConfirmModal
            open={isDeleteOpen}
            onOpenChange={setDeleteOpen}
            icon="ph:trash"
            title="Удалить вопрос?"
            description="Это действие приведёт к безвозвратному удалению вопроса"
            confirmText="Удалить"
            cancelText="Отменить"
            onConfirm={confirmDelete}
            isLoading={deleteMutation.isPending}
            loadingText="Удаление..."
          />
        </div>
      </div>
    </PageContainer>
  );
}

export const Component = QaEditPage;
