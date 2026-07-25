import { Icon } from "@iconify/react";
import { generatePath, useNavigate, useParams } from "react-router";

import { ConfirmModal } from "@/features/confirm-modal";
import { ROUTES } from "@/shared/model/routes";
import { PageContainer } from "@/shared/ui/page-container";

import { QUESTION_ANSWER_FORM_ID } from "./model/constants";
import { useQaDetailsPage } from "./model/use-qa-details-page";
import { QuestionAnswersSection } from "./ui/question-answers-section";
import { QuestionAnswerForm } from "./ui/question-answer-form";
import { QuestionDetailsCard } from "./ui/question-details-card";
import { QuestionDetailsSidebar } from "./ui/question-details-sidebar";
import { QuestionError } from "./ui/question-error";
import { QuestionLoading } from "./ui/question-loading";

function QaDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const questionId = id ?? "";
  const page = useQaDetailsPage(questionId);
  const answerFormHref = `${generatePath(ROUTES.QA_DETAILS, { id: questionId })}#${QUESTION_ANSWER_FORM_ID}`;

  if (page.isQuestionPending) {
    return <QuestionLoading />;
  }

  if (page.isQuestionError || !page.question) {
    return <QuestionError />;
  }

  return (
    <PageContainer className="py-8 max-md:px-4 md:py-10">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-5 hidden cursor-pointer items-center gap-2 text-base font-semibold text-foreground transition-colors hover:text-primary md:inline-flex"
      >
        <Icon icon="ph:arrow-left" className="size-6" />
        Назад
      </button>

      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="Назад"
        className="mb-5 inline-flex cursor-pointer items-center gap-2 text-foreground transition-colors hover:text-primary md:hidden"
      >
        <Icon icon="ph:arrow-left" className="size-6" />
      </button>

      <div className="grid gap-4 xl:grid-cols-[273px_1fr] xl:gap-13">
        <QuestionDetailsSidebar
          question={page.question}
          answerCount={page.visibleAnswerCount}
          isOwner={page.isOwner}
          editHref={generatePath(ROUTES.QA_EDIT, { id: questionId })}
          isDeleting={page.isQuestionDeleting}
          onDeleteRequest={() => page.setQuestionDeleteOpen(true)}
        />

        <div className="flex min-w-0 flex-col gap-4">
          <QuestionDetailsCard
            question={page.question}
            answerCount={page.visibleAnswerCount}
            answerFormHref={answerFormHref}
          />

          <QuestionAnswerForm
            id={QUESTION_ANSWER_FORM_ID}
            title="Добавить ответ"
            description="Поделитесь опытом, уточните деталь или оставьте полезный ответ."
            label="Ответ"
            value={page.answerContent}
            onChange={page.setAnswerContent}
            onSubmit={page.handleAnswerSubmit}
            isSubmitting={page.isAnswerCreating}
            submitLabel="Отправить"
            editorRef={page.answerEditorRef}
          />

          <QuestionAnswersSection
            answerCount={page.visibleAnswerCount}
            answerThreads={page.answerThreads}
            answerSortMode={page.answerSortMode}
            onAnswerSortModeChange={page.setAnswerSortMode}
            showOnlyTopLevelAnswers={page.showOnlyTopLevelAnswers}
            onToggleTopLevelAnswers={() =>
              page.setShowOnlyTopLevelAnswers((current) => !current)
            }
            replyToAnswerId={page.replyToAnswerId}
            replyAnswerContent={page.replyAnswerContent}
            isReplySubmitting={page.isAnswerCreating}
            onToggleReply={page.handleToggleReply}
            onReplyChange={page.setReplyAnswerContent}
            onReplySubmit={page.handleReplySubmit}
            onDeleteRequest={page.setAnswerDeleteTarget}
          />
        </div>
      </div>

      <ConfirmModal
        open={page.isQuestionDeleteOpen}
        onOpenChange={page.setQuestionDeleteOpen}
        icon="ph:trash"
        title="Удалить вопрос?"
        description="Это действие приведёт к безвозвратному удалению вопроса"
        confirmText="Удалить"
        cancelText="Отменить"
        onConfirm={page.onQuestionDeleteConfirm}
        isLoading={page.isQuestionDeleting}
        loadingText="Удаление..."
      />

      <ConfirmModal
        open={Boolean(page.answerDeleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            page.setAnswerDeleteTarget(null);
          }
        }}
        icon="ph:trash"
        title="Удалить ответ?"
        description={
          page.answerDeleteTarget?.replies.length
            ? "Ответ будет удалён, а его дочерние ответы останутся в ветке."
            : "Ответ будет удалён без возможности восстановления."
        }
        confirmText="Удалить"
        cancelText="Отменить"
        onConfirm={page.onAnswerDeleteConfirm}
        isLoading={page.isAnswerDeleting}
        loadingText="Удаление..."
      />
    </PageContainer>
  );
}

export const Component = QaDetailsPage;
