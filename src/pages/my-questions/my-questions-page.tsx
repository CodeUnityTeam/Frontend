import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import { generatePath, useNavigate } from "react-router";
import { toast } from "sonner";

import {
  deleteQuestion,
  useQuestions,
} from "@/entities/question";
import { ConfirmModal } from "@/features/confirm-modal";
import { ROUTES } from "@/shared/model/routes";
import { PageContainer } from "@/shared/ui/page-container";
import { Button } from "@/shared/ui/button";
import { MyQuestionsCard } from "@/widgets/my-questions/ui/my-questions";
import type { QuestionData } from "@/widgets/question-card";
import { mapQuestion } from "@/pages/qa/model/question-mapper";

export function MyQuestionsPage() {
  const navigate = useNavigate();
  const back = () => navigate(-1);
  const [questionToDelete, setQuestionToDelete] =
    useState<QuestionData | null>(null);
  const questionsQuery = useQuestions({ filter: "my" });
  const deleteMutation = useMutation({
    mutationFn: deleteQuestion,
    onSuccess: () => {
      toast.success("Вопрос удалён");
      setQuestionToDelete(null);
      void questionsQuery.refetch();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const questions =
    questionsQuery.data?.pages.flatMap((page) => page.items.map(mapQuestion)) ??
    [];
  const totalQuestions = questionsQuery.data?.pages[0]?.total ?? questions.length;
  const remainingQuestions = Math.max(totalQuestions - questions.length, 0);

  const handleConfirmDelete = () => {
    if (!questionToDelete) {
      return;
    }

    deleteMutation.mutate(questionToDelete.id);
  };

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
          <h1 className="text-[36px] leading-[1.3] font-semibold text-[var(--color-black)]">
            Мои вопросы
          </h1>

          {questionsQuery.isPending ? (
            <p className="mt-5 text-base text-foreground">Загрузка вопросов...</p>
          ) : questionsQuery.error ? (
            <p className="mt-5 text-base text-foreground">
              Не удалось загрузить вопросы.
            </p>
          ) : questions.length > 0 ? (
            <>
              {questions.map((question) => (
                <MyQuestionsCard
                  key={question.id}
                  question={question}
                  editHref={generatePath(ROUTES.QA_EDIT, {
                    id: question.id,
                  })}
                  onDelete={() => setQuestionToDelete(question)}
                  isDeleting={
                    deleteMutation.isPending &&
                    questionToDelete?.id === question.id
                  }
                />
              ))}

              {questionsQuery.hasNextPage && (
                <div className="mt-6 flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => questionsQuery.fetchNextPage()}
                    disabled={questionsQuery.isFetchingNextPage}
                  >
                    {questionsQuery.isFetchingNextPage
                      ? "Загрузка..."
                      : `Загрузить ещё ${remainingQuestions}`}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <p className="mt-5 text-base text-foreground">
              У вас пока нет вопросов.
            </p>
          )}
        </section>
      </div>

      <ConfirmModal
        open={Boolean(questionToDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setQuestionToDelete(null);
          }
        }}
        icon="ph:trash"
        title="Удалить вопрос?"
        description={
          questionToDelete
            ? `Вопрос «${questionToDelete.title}» будет удалён без возможности восстановления.`
            : "Вопрос будет удалён без возможности восстановления."
        }
        confirmText="Удалить"
        cancelText="Отменить"
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
        loadingText="Удаление..."
      />
    </PageContainer>
  );
}

export const Component = MyQuestionsPage;
