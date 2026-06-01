import { useRef, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import type { RegisterFormData } from "../model/use-register-form";

interface StepMeetMeProps {
  data: RegisterFormData;
  onNext: (patch: Partial<RegisterFormData>) => void;
}

interface FormErrors {
  name?: string;
  surname?: string;
}

export function OnboardingStep1({ data, onNext }: StepMeetMeProps) {
  const [name, setName] = useState(data.name);
  const [surname, setSurname] = useState(data.surname);
  const [patronym, setPatronym] = useState(data.patronym);
  const [photo, setPhoto] = useState<File | null>(data.photo);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    data.photo ? URL.createObjectURL(data.photo) : null,
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!name.trim()) next.name = "Имя обязательно для заполнения";
    if (!surname.trim()) next.surname = "Фамилия обязательна для заполнения";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onNext({ name: name.trim(), surname: surname.trim(), patronym: patronym.trim(), photo });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
      <div>
        <h1 className="text-2xl font-semibold">Познакомимся</h1>
        <p className="mt-1 text-muted-foreground">
          Это ваш первый шаг к новым проектам и возможностям.
        </p>
      </div>

      {/* Photo upload */}
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-end">
        <Avatar className="size-24 text-2xl">
          {photoPreview && <AvatarImage src={photoPreview} alt="Аватар" />}
          <AvatarFallback>
            {name ? name[0].toUpperCase() : "?"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            Загрузить картинку
          </Button>
          <span className="text-xs text-muted-foreground">
            Optional · JPG, PNG, WEBP
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Input
          label="Имя"
          placeholder="Имя"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
          }}
          error={errors.name}
          autoFocus
        />
        <Input
          label="Фамилия"
          placeholder="Фамилия"
          value={surname}
          onChange={(e) => {
            setSurname(e.target.value);
            if (errors.surname)
              setErrors((prev) => ({ ...prev, surname: undefined }));
          }}
          error={errors.surname}
        />
        <Input
          label="Отчество"
          placeholder="Отчество (укажите по желанию)"
          value={patronym}
          onChange={(e) => setPatronym(e.target.value)}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" size="lg">
          Далее
        </Button>
      </div>
    </form>
  );
}
