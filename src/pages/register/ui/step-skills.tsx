import { useRef, useState } from "react";

import { Button } from "@/shared/ui/button";
import { registerTag as RegisterTag } from "@/shared/ui/tag";
import { SKILLS_SUGGESTIONS } from "../model/skills";
import type { RegisterFormData } from "../model/use-register-form";

interface StepSkillsProps {
  data: RegisterFormData;
  onNext: (patch: Partial<RegisterFormData>) => void;
  onBack: () => void;
  onPatch: (patch: Partial<RegisterFormData>) => void;
}

export function OnboardingStep2({ data, onNext, onBack, onPatch }: StepSkillsProps) {
  const [skills, setSkills] = useState<string[]>(data.skills);
  const [inputValue, setInputValue] = useState<string>(data.skillsDraft ?? "");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onPatch?.({ skillsDraft: value });

    if (value.trim()) {
      const filtered = SKILLS_SUGGESTIONS.filter(
        (s) =>
          s.toLowerCase().includes(value.toLowerCase()) &&
          !skills.includes(s),
      );
      setSuggestions(filtered.slice(0, 6));
    } else {
      setSuggestions([]);
    }
  };

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed || skills.includes(trimmed)) return;
    const next = [...skills, trimmed];
    setSkills(next);
    setInputValue("");
    setSuggestions([]);
    inputRef.current?.focus();
    onPatch?.({ skills: next, skillsDraft: "" });
  };

  const removeSkill = (skill: string) => {
    const next = skills.filter((s) => s !== skill);
    setSkills(next);
    onPatch?.({ skills: next });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions.length > 0) {
        addSkill(suggestions[0]);
      } else if (inputValue.trim()) {
        addSkill(inputValue);
      }
    }
    if (e.key === "Backspace" && !inputValue && skills.length > 0) {
      const next = skills.slice(0, -1);
      setSkills(next);
      onPatch?.({ skills: next });
    }
    if (e.key === "Escape") {
      setSuggestions([]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full py-8">
      {/* Hero / Info card (outlined white) */}
      <div className="mx-auto border border-border bg-background rounded-[18px] px-6 py-5 sm:px-8 sm:py-6">
        <h1 className="text-3xl sm:text-2xl font-semibold pl-12 sm:pl-16">Ваши навыки</h1>
        <p className="mt-2 text-muted-foreground leading-snug pl-12 sm:pl-16">
          Чем больше навыков, тем выше шанс найти интересные предложения
        </p>
      </div>

      {/* Skills block (reduced mobile spacing) */}
      <div className="mt-12 sm:mt-20">
        <div>
          <label className="text-lg font-medium">Навыки и инструменты</label>
          <p className="mt-1 text-sm text-muted-foreground">Выберите программы, которыми вы владеете</p>
        </div>

        <div className="mt-6">
          <div
            className="flex min-h-14 cursor-text flex-wrap items-center gap-2 rounded-lg border border-input bg-background px-4 py-3 focus-within:ring-2 focus-within:ring-ring"
            onClick={() => inputRef.current?.focus()}
          >
            {/* Existing tags */}
            {skills.map((skill) => (
              <RegisterTag
                key={skill}
                label={skill}
                onRemove={(e) => {
                  e.stopPropagation();
                  removeSkill(skill);
                }}
              />
            ))}

            {/* Text input */}
            <input
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={skills.length === 0 ? "Начните вводить здесь" : ""}
              className="min-w-35 basis-32 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />
          </div>

          {/* Autocomplete dropdown */}
          {suggestions.length > 0 && (
            <ul className="mt-2 rounded-md border border-border bg-popover shadow-sm max-h-64 overflow-y-auto">
              {suggestions.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    className="w-full px-4 py-3 text-left text-sm hover:bg-accent"
                    onMouseDown={(e) => {
                      // prevent input blur before click registers
                      e.preventDefault();
                      addSkill(s);
                    }}
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          )}

          <p className="hidden sm:block text-xs text-muted-foreground mt-3">
            Нажмите Enter, чтобы добавить · Backspace, чтобы удалить последний навык · Escape, чтобы закрыть подсказки
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:mt-12 sm:flex-row sm:justify-between">
          <Button type="button" variant="outline" size="lg" onClick={onBack} className="w-full sm:w-auto">
            Предыдущий шаг
          </Button>
          <Button type="button" size="lg" onClick={() => onNext({ skills })} className="w-full sm:w-auto">
            Следующий шаг
          </Button>
        </div>
      </div>
    </div>
  );
}
