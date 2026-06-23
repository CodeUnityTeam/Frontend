import { useState } from "react";
import { Icon } from "@iconify/react";

import { Slider } from "@/shared/ui/slider";
import { cn } from "@/shared/lib/utils";

import { useFilters } from "../model/filters-context";
import {
  DURATION_FROM_LABEL,
  DURATION_MAX,
  DURATION_MIN,
  DURATION_TITLE,
  DURATION_TO_LABEL,
} from "../model/filters-data";

export function DurationSlider() {
  const { duration, setDuration } = useFilters();
  const [open, setOpen] = useState(true);

  return (
    <section className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between py-1 text-left"
      >
        <span className="text-xl leading-[1.3] font-semibold text-foreground">
          {DURATION_TITLE}
        </span>
        <Icon
          icon="lucide:chevron-up"
          className={cn(
            "size-6 shrink-0 text-foreground transition-transform",
            !open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="rounded-lg bg-muted p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[18px] leading-normal text-foreground">
              {DURATION_FROM_LABEL}
            </span>
            <span className="rounded-lg bg-background px-3 py-1 text-base font-semibold text-muted-foreground">
              {duration >= DURATION_MAX
                ? DURATION_TO_LABEL
                : `до ${duration} дн.`}
            </span>
          </div>
          <Slider
            value={[duration]}
            onValueChange={(values) => setDuration(values[0])}
            min={DURATION_MIN}
            max={DURATION_MAX}
            step={1}
            aria-label={DURATION_TITLE}
          />
        </div>
      )}
    </section>
  );
}
