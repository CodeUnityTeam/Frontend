import { cn } from "@/shared/lib/utils";
import type { Step } from "../model/use-register-form";
import { TOTAL_STEPS } from "../model/use-register-form";

interface OnboardingLayoutProps {
  step: Step;
  children: React.ReactNode;
}

export function OnboardingLayout({ step, children }: OnboardingLayoutProps) {
  return (
    <div className="flex flex-col">
      {/* Progress bar */}
      <div className="border-b px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-2xl items-center gap-4">
          <span className="shrink-0 text-sm text-muted-foreground">
            {step} / {TOTAL_STEPS}
          </span>
          <div className="flex flex-1 gap-1">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  i + 1 <= step ? "bg-primary" : "bg-muted",
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-2xl">{children}</div>
      </main>
    </div>
  );
}
