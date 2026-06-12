import React from "react";

import { cn } from "@/shared/lib/utils";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  label?: React.ReactNode;
  onRemove?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(({ label, className, onRemove, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1 rounded-sm bg-secondary px-2 py-0.5 text-sm",
        className,
      )}
      {...props}
    >
      <span>{label}</span>
      {onRemove && (
        <button
          type="button"
          aria-label={`Remove ${String(label)}`}
          className="text-muted-foreground hover:text-foreground"
          onClick={onRemove}
        >
          ×
        </button>
      )}
    </span>
  );
});
Tag.displayName = "Tag";

export { Tag };
