import { cn } from "@/shared/lib/utils";
import React from "react";

type TagVariant = "default" | "accent" | "muted" | "outline";

type TagProps = {
  children?: React.ReactNode;
  label?: string;
  variant?: TagVariant;
  className?: string;
  onRemove?: (e: React.MouseEvent) => void;
  onClick?: (e: React.MouseEvent) => void;
};

export const Tag = ({
  children,
  label,
  variant = "default",
  className,
  onClick,
}: TagProps) => {
  const base =
    "inline-flex cursor-pointer items-center rounded-full px-3 py-1 text-sm font-medium";

  const variants: Record<TagVariant, string> = {
    default: "bg-muted text-foreground",
    accent: "bg-primary text-primary-foreground",
    muted: "bg-muted text-muted-foreground",
    outline: "border text-foreground text-lg"
  };

  return (
    <span className={cn(base, variants[variant], className)} onClick={onClick}>
      {children ?? label}
    </span>
  );
};
