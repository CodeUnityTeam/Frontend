import { Icon } from "@iconify/react";

export function QaListEmpty() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-muted px-6 py-16 text-center">
      <Icon icon="ph:chat-circle-dots" className="size-12 text-muted-foreground" />
      <h3 className="text-xl font-semibold text-foreground">Вопросов не найдено</h3>
      <p className="max-w-md text-sm text-muted-foreground">
        Попробуйте изменить фильтры или поисковый запрос
      </p>
    </div>
  );
}
