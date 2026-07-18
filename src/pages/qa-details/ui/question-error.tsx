import { PageContainer } from "@/shared/ui/page-container";

export function QuestionError() {
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