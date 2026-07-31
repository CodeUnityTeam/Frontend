import { useRef, useState } from "react";
import { Icon } from "@iconify/react";

import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import type { RegisterFormData } from "@/pages/register/model/use-register-form";

interface StepAboutProps {
  data: RegisterFormData;
  onNext: (patch: Partial<RegisterFormData>) => void;
  onBack: () => void;
  onPatch: (patch: Partial<RegisterFormData>) => void;
  isSubmitting?: boolean;
}

export function OnboardingStep4({
  data,
  onNext,
  onBack,
  onPatch,
  isSubmitting = false,
}: StepAboutProps) {
  const [qualities, setQualities] = useState<string[]>(data.qualities ?? []);
  const [qualityInput, setQualityInput] = useState<string>(
    data.qualitiesDraft ?? "",
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const [about, setAbout] = useState(data.about);

  const addQuality = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed || qualities.includes(trimmed)) return;
    const next = [...qualities, trimmed];
    setQualities(next);
    setQualityInput("");
    inputRef.current?.focus();
    onPatch?.({ qualities: next, qualitiesDraft: "" });
  };

  const removeQuality = (q: string) => {
    const next = qualities.filter((x) => x !== q);
    setQualities(next);
    onPatch?.({ qualities: next });
  };

  const handleQualityKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (qualityInput.trim()) addQuality(qualityInput);
    }
    if (e.key === "Backspace" && !qualityInput && qualities.length > 0) {
      const next = qualities.slice(0, -1);
      setQualities(next);
      onPatch?.({ qualities: next });
    }
    if (e.key === "Escape") {
      setQualityInput("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPatch?.({ qualities });
    onNext({ about, qualities });
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-3xl py-8">
      {/* Intro card (outlined white) */}
      <div className="mx-auto rounded-[18px] border border-border bg-background px-6 py-5 sm:px-8 sm:py-6">
        <h1 className="pl-12 text-3xl font-semibold sm:pl-16 sm:text-2xl">
          О вас
        </h1>
        <p className="mt-2 pl-12 leading-snug text-muted-foreground sm:pl-16">
          Добавьте немного личности. Так проще найти своих людей
        </p>
      </div>

      {/* Form area (reduced mobile spacing) */}
      <div className="mt-8 flex flex-col gap-6 sm:mt-18">
        <div>
          <label className="text-sm font-medium">Личные качества</label>

          <div
            className="mt-2 flex min-h-14 cursor-text flex-wrap items-center gap-2 rounded-lg border border-input bg-background px-4 py-3"
            onClick={() => inputRef.current?.focus()}
          >
            {qualities.map((q) => (
              <span
                key={q}
                className="flex items-center gap-1 rounded-sm bg-secondary px-2 py-0.5 text-sm"
              >
                {q}
                <button
                  type="button"
                  aria-label={`Remove ${q}`}
                  className="text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeQuality(q);
                  }}
                >
                  ×
                </button>
              </span>
            ))}

            <input
              ref={inputRef}
              value={qualityInput}
              onChange={(e) => {
                setQualityInput(e.target.value);
                onPatch?.({ qualitiesDraft: e.target.value });
              }}
              onKeyDown={handleQualityKeyDown}
              placeholder={qualities.length === 0 ? "Ваши преимущества" : ""}
              className="min-w-35 flex-1 basis-32 bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div>
          <Textarea
            label="О себе"
            placeholder="Расскажите о себе"
            value={about}
            onChange={(e) => {
              setAbout(e.target.value);
              onPatch?.({ about: e.target.value });
            }}
            className="min-h-32 sm:min-h-44"
          />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:mt-12 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onBack}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Предыдущий шаг
          </Button>
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Icon icon="ph:spinner" className="mr-2 animate-spin" />
                Сохраняем...
              </>
            ) : (
              "Завершить"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
