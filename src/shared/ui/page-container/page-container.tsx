import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/utils";

/** Горизонтальные отступы страницы: 16px → 80px (плавно между 320px и 1440px viewport). */
export function PageContainer({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "px-[clamp(1rem,calc(1rem+(100vw-20rem)*64/1120),5rem)]",
        className,
      )}
      {...props}
    />
  );
}
