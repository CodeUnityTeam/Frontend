import { useState } from "react";

import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import type { RegisterFormData } from "../model/use-register-form";

interface StepAboutProps {
  data: RegisterFormData;
  onNext: (patch: Partial<RegisterFormData>) => void;
  onBack: () => void;
}

export function OnboardingStep4({ data, onNext, onBack }: StepAboutProps) {
  const [about, setAbout] = useState(data.about);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ about });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">О вас</h1>
        <p className="mt-1 text-muted-foreground">
          Напишите короткую биографию — она будет видна в вашем профиле.
        </p>
      </div>

      <Textarea
        label="О себе"
        placeholder="Расскажите команде о себе, своих интересах, целях…"
        value={about}
        onChange={(e) => setAbout(e.target.value)}
        className="min-h-44"
      />

      <div className="flex justify-between">
        <Button type="button" variant="outline" size="lg" onClick={onBack}>
          Назад
        </Button>
        <Button type="submit" size="lg">
          Завершить
        </Button>
      </div>
    </form>
  );
}
