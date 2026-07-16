import { Button } from "@/shared/ui/button";

export function ProjectsError({
  onRetry,
  message = "Не удалось загрузить проекты. Попробуйте ещё раз.",
}: {
  onRetry: () => void;
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="text-muted-foreground">{message}</p>
      <Button type="button" onClick={onRetry}>
        Повторить
      </Button>
    </div>
  );
}