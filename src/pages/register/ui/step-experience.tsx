import { useState } from "react";

import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { Input } from "@/shared/ui/input";
import type { RegisterFormData } from "../model/use-register-form";

interface StepExperienceProps {
  data: RegisterFormData;
  onNext: (patch: Partial<RegisterFormData>) => void;
  onBack: () => void;
}

export function OnboardingStep3({ data, onNext, onBack }: StepExperienceProps) {
  const [experience, setExperience] = useState(data.experience);
  const [projects, setProjects] = useState(data.projects);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">Опыт и проекты</h1>
        <p className="mt-1 text-muted-foreground">
          Поделитесь своим профессиональным опытом и значимыми проектами.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Input
          label="Опыт работы"
          placeholder="Например, 3 года в разработке фронтенда"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        />
        <Textarea
          label="Проекты"
          placeholder="Опишите проекты, над которыми вы работали…"
          value={projects}
          onChange={(e) => setProjects(e.target.value)}
          className="min-h-36"
        />
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" size="lg" onClick={onBack}>
          Назад
        </Button>
        <Button
          type="button"
          size="lg"
          onClick={() => onNext({ experience, projects })}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
