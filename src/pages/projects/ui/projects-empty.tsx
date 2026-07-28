import { Icon } from "@iconify/react";

export function ProjectsEmpty({
  title = "Пока нет проектов",
  description = "Здесь появятся проекты, как только их опубликуют. Загляните чуть позже.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-muted px-6 py-16 text-center">
      <Icon icon="ph:folder-dashed" className="size-12 text-muted-foreground" />
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
