import { useRef, useState, useEffect } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import type { RegisterFormData } from "../model/use-register-form";
import { COUNTRY_MAP } from "../model/country-map";
import pictureSvg from "@/shared/assets/icons/picture.svg";

interface StepMeetMeProps {
  data: RegisterFormData;
  onNext: (patch: Partial<RegisterFormData>) => void;
  onPatch: (patch: Partial<RegisterFormData>) => void;
}

interface FormErrors {
  name?: string;
  surname?: string;
}

export function OnboardingStep1({ data, onNext, onPatch }: StepMeetMeProps) {
  const [name, setName] = useState(data.name);
  const [surname, setSurname] = useState(data.surname);
  const [position, setposition] = useState(data.position);
  const [photo, setPhoto] = useState<File | null>(data.photo);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    data.photo ? URL.createObjectURL(data.photo) : null,
  );
  const [employmentRole, setEmploymentRole] = useState<"worker" | "employer">(
    (data.employmentRole as "worker" | "employer") ?? "worker",
  );
  const [format, setFormat] = useState<string>(data.format ?? "");
  const [country, setCountry] = useState<string>(data.country ?? "");
  const [city, setCity] = useState<string>(data.city ?? "");
  const [errors, setErrors] = useState<FormErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    setPhoto(file);
    const next = URL.createObjectURL(file);
    setPhotoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return next;
    });

    onPatch?.({ photo: file });
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
    onNext({
      name: name.trim(),
      surname: surname.trim(),
      position: position.trim(),
      photo,
      employmentRole,
      format,
      country,
      city,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <div className="mx-auto w-full max-w-3xl">
        {}
        <div className="mx-auto rounded-[20px] border border-border bg-background px-6 py-5 sm:px-12 sm:py-6">
          <h1 className="text-3xl font-semibold sm:text-2xl">Познакомимся</h1>
          <p className="mt-2 text-muted-foreground">
            Это ваш первый шаг к новым проектам и возможностям
          </p>
        </div>

        {}
        <div className="mt-8 flex flex-col items-start gap-6 sm:flex-row">
          <div className="shrink-0 self-center sm:self-start">
            <Avatar
              className="h-52.5 w-52.5 cursor-pointer text-2xl transition-shadow hover:shadow-sm sm:h-33.5 sm:w-33.5"
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  fileInputRef.current?.click();
              }}
              aria-label="Загрузить фото"
            >
              {photoPreview ? (
                <AvatarImage src={photoPreview} alt="Аватар" />
              ) : (
                <AvatarFallback className="bg-[#DDE1E6]">
                  {(() => {
                    const a = name?.[0] ?? "";
                    const b = surname?.[0] ?? "";
                    const initials = (a + b).toUpperCase();
                    if (initials) return initials;
                    return (
                      <img
                        src={pictureSvg}
                        alt="placeholder"
                        className="h-full w-full object-contain"
                        aria-hidden
                      />
                    );
                  })()}
                </AvatarFallback>
              )}
            </Avatar>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>

          <div className="grid w-full flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              placeholder="Имя"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name)
                  setErrors((prev) => ({ ...prev, name: undefined }));
                onPatch?.({ name: e.target.value });
              }}
              error={errors.name}
              autoFocus
              className="h-14 rounded-[16px]"
            />

            <Input
              placeholder="Фамилия"
              value={surname}
              onChange={(e) => {
                setSurname(e.target.value);
                if (errors.surname)
                  setErrors((prev) => ({ ...prev, surname: undefined }));
                onPatch?.({ surname: e.target.value });
              }}
              error={errors.surname}
              className="h-14 rounded-[16px]"
            />

            <div className="sm:col-span-2">
              <Input
                placeholder="Занимаемая должность"
                value={position}
                onChange={(e) => {
                  setposition(e.target.value);
                  onPatch?.({ position: e.target.value });
                }}
                className="h-14 rounded-[16px]"
              />
            </div>
          </div>
        </div>

        {}
        <div className="mt-6 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <span className="text-[20px] font-semibold text-foreground">
              Роль
            </span>
            <div className="flex flex-wrap items-center gap-4">
              <label className="inline-flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="employmentRole"
                  value="worker"
                  checked={employmentRole === "worker"}
                  onChange={() => {
                    setEmploymentRole("worker");
                    onPatch?.({ employmentRole: "worker" });
                  }}
                  className="h-5 w-5 shrink-0 cursor-pointer accent-primary"
                />
                <span className="text-base text-foreground">Сотрудник</span>
              </label>

              <label className="inline-flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="employmentRole"
                  value="employer"
                  checked={employmentRole === "employer"}
                  onChange={() => {
                    setEmploymentRole("employer");
                    onPatch?.({ employmentRole: "employer" });
                  }}
                  className="h-5 w-5 shrink-0 cursor-pointer accent-primary"
                />
                <span className="text-base text-foreground">Работодатель</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[20px] font-semibold text-foreground">
              Страна
            </label>
            <select
              value={country}
              onChange={(e) => {
                const val = e.target.value;
                setCountry(val);

                const nextCities = COUNTRY_MAP[val] ?? [];
                const nextCity = nextCities[0] ?? "";
                setCity(nextCity);
                onPatch?.({ country: val, city: nextCity });
              }}
              className={`h-14 w-full rounded-[16px] border border-input bg-background px-4 py-3 ${
                country ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <option value="">Страна проживания</option>
              {Object.keys(COUNTRY_MAP).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[20px] font-semibold text-foreground">
              Город
            </label>
            <select
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                onPatch?.({ city: e.target.value });
              }}
              className={`h-14 w-full rounded-[16px] border border-input bg-background px-4 py-3 ${
                city ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <option value="">Город проживания</option>
              {(COUNTRY_MAP[country] ?? []).map((ct) => (
                <option key={ct} value={ct}>
                  {ct}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-[20px] font-semibold text-foreground">
              Формат
            </span>
            <div className="flex flex-wrap items-center gap-4">
              <label className="inline-flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="format"
                  value="remote"
                  checked={format === "remote"}
                  onChange={() => {
                    setFormat("remote");
                    onPatch?.({ format: "remote" });
                  }}
                  className="h-5 w-5 shrink-0 cursor-pointer accent-primary"
                />
                <span className="text-base text-foreground">Удалённо</span>
              </label>

              <label className="inline-flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="format"
                  value="hybrid"
                  checked={format === "hybrid"}
                  onChange={() => {
                    setFormat("hybrid");
                    onPatch?.({ format: "hybrid" });
                  }}
                  className="h-5 w-5 shrink-0 cursor-pointer accent-primary"
                />
                <span className="text-base text-foreground">Гибрид</span>
              </label>

              <label className="inline-flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="format"
                  value="office"
                  checked={format === "office"}
                  onChange={() => {
                    setFormat("office");
                    onPatch?.({ format: "office" });
                  }}
                  className="h-5 w-5 shrink-0 cursor-pointer accent-primary"
                />
                <span className="text-base text-foreground">В офисе</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-stretch sm:justify-end">
          <Button type="submit" size="lg" className="w-full sm:w-auto">
            Следующий шаг
          </Button>
        </div>
      </div>
    </form>
  );
}
