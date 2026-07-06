import { useState } from "react";

import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { Input } from "@/shared/ui/input";
import { Icon } from "@iconify/react";
import type {
  RegisterFormData,
  ExperienceEntry,
} from "../model/use-register-form";

interface StepExperienceProps {
  data: RegisterFormData;
  onNext: (patch: Partial<RegisterFormData>) => void;
  onBack: () => void;
  onPatch: (patch: Partial<RegisterFormData>) => void;
}

export function OnboardingStep3({
  data,
  onNext,
  onBack,
  onPatch,
}: StepExperienceProps) {
  const [entries, setEntries] = useState<ExperienceEntry[]>(() => {
    const fromModel =
      data.experiences && data.experiences.length > 0
        ? data.experiences
        : undefined;
    if (fromModel) {
      return fromModel.map((e) => ({
        company: e.company ?? "",
        position: e.position ?? "",
        responsibilities: e.responsibilities ?? "",
        startDate: e.startDate ?? "",
        endDate: e.endDate ?? "",
      }));
    }
    return [
      {
        company: "",
        position: data.experience ?? "",
        responsibilities: data.projects ?? "",
        startDate: "",
        endDate: "",
      },
    ];
  });

  const updateEntry = (index: number, patch: Partial<ExperienceEntry>) => {
    const next = [...entries];
    next[index] = { ...next[index], ...patch };
    setEntries(next);

    const mapped: Partial<RegisterFormData> = {
      experiences: next,
      experience: next[index].position,
      projects: next[index].responsibilities,
      company: next[index].company,
      startDate: next[index].startDate,
      endDate: next[index].endDate,
    };
    onPatch?.(mapped);
  };

  const first = entries[0];

  const handleNext = () => {
    onNext({
      experience: first.position,
      projects: first.responsibilities,
      company: first.company,
      startDate: first.startDate,
      endDate: first.endDate,
    });
  };

  return (
    <div className="mx-auto w-full max-w-3xl py-8">
      {/* Intro card (outlined white) */}
      <div className="mx-auto rounded-[18px] border border-border bg-background px-6 py-5 sm:px-8 sm:py-6">
        <h1 className="pl-12 text-3xl font-semibold sm:pl-16 sm:text-2xl">
          Опыт и проекты
        </h1>
        <p className="mt-2 pl-12 leading-snug text-muted-foreground sm:pl-16">
          Расскажите, над чем вы уже работали. Это поможет оценить ваш уровень и
          пригласить в подходящие проекты. Укажите ваш лучший опыт, позже вы
          сможете добавить проекты в вашем профиле.
        </p>
      </div>

      {/* Form area (reduced mobile spacing) */}
      <div className="mt-8 sm:mt-16">
        <div className="flex flex-col gap-6">
          <Input
            label="Название компании"
            placeholder="Например Яндекс"
            value={first.company}
            onChange={(e) => updateEntry(0, { company: e.target.value })}
          />

          <Input
            label="Должность"
            placeholder="Например Дизайнер"
            value={first.position}
            onChange={(e) => updateEntry(0, { position: e.target.value })}
          />

          <Textarea
            label="Обязанности"
            placeholder="Распишите подробно свои обязанности"
            value={first.responsibilities}
            onChange={(e) =>
              updateEntry(0, { responsibilities: e.target.value })
            }
            className="min-h-32 sm:min-h-36"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Дата начала проекта"
              type="date"
              placeholder="дд.мм.гггг"
              value={first.startDate}
              onChange={(e) => updateEntry(0, { startDate: e.target.value })}
              rightElement={<Icon icon="lucide:calendar" />}
              className="h-14 text-base"
            />

            <Input
              label="Дата окончания проекта"
              type="date"
              placeholder="дд.мм.гггг"
              value={first.endDate}
              onChange={(e) => updateEntry(0, { endDate: e.target.value })}
              rightElement={<Icon icon="lucide:calendar" />}
              className="h-14 text-base"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:mt-12 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onBack}
            className="w-full sm:w-auto"
          >
            Предыдущий шаг
          </Button>
          <Button
            type="button"
            size="lg"
            onClick={handleNext}
            className="w-full sm:w-auto"
          >
            Следующий шаг
          </Button>
        </div>
      </div>
    </div>
  );
}
