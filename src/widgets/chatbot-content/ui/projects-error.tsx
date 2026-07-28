import { Button } from "@/shared/ui/button";

export function ProjectsError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <p className="text-muted-foreground">
        Не удалось загрузить проекты. Попробуйте ещё раз.
      </p>
      <Button type="button" onClick={onRetry}>
        Повторить
      </Button>
    </div>
  );
}