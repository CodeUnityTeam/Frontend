import { Icon } from "@iconify/react";

type Props = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
};

export const EmptyState = ({ title, description, icon }: Props) => {
  const defaultIcon = (
    <Icon icon="tabler:rocket" className="h-30 w-30 text-muted-foreground" />
  );

  return (
    <div className="flex flex-col items-center justify-center gap-12 py-10 text-center font-raleway">
      <div className="flex h-32 w-32 items-center justify-center">
        {icon ?? defaultIcon}
      </div>

      <h3 className="text-foreground">{title}</h3>

      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
};
