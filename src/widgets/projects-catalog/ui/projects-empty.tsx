import { Icon } from "@iconify/react";

type TProjectsEmpty = {
  title?: string;
  description?: string;
};

export function ProjectsEmpty({ title, description }: TProjectsEmpty) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl px-6 py-5 text-center">
      <span
        className="flex items-center justify-center rounded-[var(--radius-lg)]"
        style={{ backgroundColor: "var(--color-light-gray-200)" }}
      >
        <Icon
          icon="ph:warning-circle"
          className="h-16 w-16 text-muted-foreground"
        />
      </span>
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      <p className="max-w-md text-[18px] text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
