import { useRef, useState } from "react";

import { Button } from "@/shared/ui/button";
import { SKILLS_SUGGESTIONS } from "../model/skills";
import type { RegisterFormData } from "../model/use-register-form";

interface StepSkillsProps {
  data: RegisterFormData;
  onNext: (patch: Partial<RegisterFormData>) => void;
  onBack: () => void;
}

export function OnboardingStep2({ data, onNext, onBack }: StepSkillsProps) {
  const [skills, setSkills] = useState<string[]>(data.skills);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

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
    setSkills((prev) => [...prev, trimmed]);
    setInputValue("");
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const removeSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
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
      setSkills((prev) => prev.slice(0, -1));
    }
    if (e.key === "Escape") {
      setSuggestions([]);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">Ваши навыки</h1>
        <p className="mt-1 text-muted-foreground">
          Добавьте навыки и инструменты, с которыми вы работаете.
        </p>
      </div>

      {/* Tag input */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Навыки и инструменты</label>

        {/* Input box with tags inside */}
        <div
          className="flex min-h-12 cursor-text flex-wrap items-center gap-2 rounded-md border border-input bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-ring"
          onClick={() => inputRef.current?.focus()}
        >
          {/* Existing tags */}
          {skills.map((skill) => (
            <span
              key={skill}
              className="flex items-center gap-1 rounded-sm bg-secondary px-2 py-0.5 text-sm"
            >
              {skill}
              <button
                type="button"
                aria-label={`Remove ${skill}`}
                className="text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  removeSkill(skill);
                }}
              >
                ×
              </button>
            </span>
          ))}

          {/* Text input */}
          <input
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={skills.length === 0 ? "Type a skill…" : ""}
            className="min-w-24 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
        </div>

        {/* Autocomplete dropdown */}
        {suggestions.length > 0 && (
          <ul className="rounded-md border bg-popover shadow-sm">
            {suggestions.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  className="w-full px-3 py-2 text-left text-sm hover:bg-accent"
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

        <p className="text-xs text-muted-foreground">
          Нажмите Enter, чтобы добавить · Backspace, чтобы удалить последний навык · Escape, чтобы закрыть подсказки
        </p>
      </div>

      {/* TODO: replace with shared/ui Tag component once it is ready */}

      <div className="flex justify-between">
        <Button type="button" variant="outline" size="lg" onClick={onBack}>
          Назад
        </Button>
        <Button type="button" size="lg" onClick={() => onNext({ skills })}>
          Далее
        </Button>
      </div>
    </div>
  );
}
