export function QaListError() {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="text-muted-foreground">
        Не удалось загрузить список вопросов. Попробуйте перезагрузить страницу.
      </p>
    </div>
  );
}
