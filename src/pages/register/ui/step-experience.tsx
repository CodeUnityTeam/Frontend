import { useState } from "react";

import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { Input } from "@/shared/ui/input";
import { Icon } from "@iconify/react";
import type { RegisterFormData, ExperienceEntry } from "../model/use-register-form";

interface StepExperienceProps {
  data: RegisterFormData;
  onNext: (patch: Partial<RegisterFormData>) => void;
  onBack: () => void;
  onPatch: (patch: Partial<RegisterFormData>) => void;
}


export function OnboardingStep3({ data, onNext, onBack, onPatch }: StepExperienceProps) {
  // keep single-entry UI but store as array-ready structure for future extension
  const [entries, setEntries] = useState<ExperienceEntry[]>(() => {
    const fromModel = data.experiences && data.experiences.length > 0 ? data.experiences : undefined;
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
    setEntries((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      // persist structured experiences and maintain backwards-compatible flat fields
      const mapped: Partial<RegisterFormData> = {
        experiences: next,
        experience: next[index].position,
        projects: next[index].responsibilities,
        company: next[index].company,
        startDate: next[index].startDate,
        endDate: next[index].endDate,
      };
      onPatch?.(mapped);
      return next;
    });
  };

  const first = entries[0];

  const handleNext = () => {
    // Map first entry back to existing flat model fields for compatibility.
    onNext({
      experience: first.position,
      projects: first.responsibilities,
      company: first.company,
      startDate: first.startDate,
      endDate: first.endDate,
    });
  };

  return (
    <div className="max-w-3xl mx-auto w-full py-8">
      {/* Intro card */}
      <div className="mx-auto bg-card/50 p-6 rounded-lg border border-border">
        <h1 className="text-2xl font-semibold">Опыт и проекты</h1>
        <p className="mt-2 text-muted-foreground leading-snug">
          Расскажите, над чем вы уже работали. Это поможет оценить ваш уровень и пригласить в подходящие проекты. Укажите ваш лучший опыт, позже вы сможете добавить проекты в вашем профиле.
        </p>
      </div>

      {/* Form area (~64-80px below card) */}
      <div className="mt-16">
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
            onChange={(e) => updateEntry(0, { responsibilities: e.target.value })}
            className="min-h-36"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Дата начала проекта"
              type="date"
              placeholder="дд.мм.гггг"
              value={first.startDate}
              onChange={(e) => updateEntry(0, { startDate: e.target.value })}
              rightElement={<Icon icon="lucide:calendar" />}
            />

            <Input
              label="Дата окончания проекта"
              type="date"
              placeholder="дд.мм.гггг"
              value={first.endDate}
              onChange={(e) => updateEntry(0, { endDate: e.target.value })}
              rightElement={<Icon icon="lucide:calendar" />}
            />
          </div>
        </div>

        <div className="flex justify-between mt-12">
          <Button type="button" variant="outline" size="lg" onClick={onBack}>
            Предыдущий шаг
          </Button>
          <Button type="button" size="lg" onClick={handleNext}>
            Следующий шаг
          </Button>
        </div>
      </div>
    </div>
  );
}
