import { useRef, useState, useEffect } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Checkbox } from "@/shared/ui/checkbox";
import type { RegisterFormData } from "../model/use-register-form";
import { COUNTRY_MAP } from "../model/country-map";
import pictureSvg from "@/shared/assets/icons/picture.svg";

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
  const [position, setposition] = useState(data.position);
  const [photo, setPhoto] = useState<File | null>(data.photo);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    data.photo ? URL.createObjectURL(data.photo) : null,
  );
  const [remote, setRemote] = useState<boolean>(!!data.remote);
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
      remote,
      country,
      city,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <div className="">
        <h1 className="text-2xl font-semibold">Познакомимся</h1>
        <p className="mt-1 text-muted-foreground">
          Это ваш первый шаг к новым проектам и возможностям.
        </p>
      </div>

      <div className="bg-card/50 p-6  ">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="flex-shrink-0 flex flex-col items-center sm:items-start gap-3 w-full sm:w-44">
            <div className="relative">
              <Avatar
                className="w-[134px] h-[134px] text-2xl rounded-[8px] cursor-pointer"
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
                }}
                aria-label="Загрузить фото"
              >
                {photoPreview ? (
                  <AvatarImage src={photoPreview} alt="Аватар" />
                ) : (
                  <AvatarFallback className="rounded-[8px] bg-[#DDE1E6]">
                    {(() => {
                      const a = name?.[0] ?? "";
                      const b = surname?.[0] ?? "";
                      const initials = (a + b).toUpperCase();
                      if (initials) return initials;
                      return (
                        <img
                          src={pictureSvg}  
                          alt="placeholder"
                          className="w-[100%] h-[100%] object-contain"
                          aria-hidden
                        />
                      );
                    })()}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>

            <div className="flex flex-col items-center sm:items-start gap-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
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
              </div>

              <div>
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
              </div>

              <div className="sm:col-span-2">
                <Input
                  label="Должность"
                  placeholder="Занимаемая должность"
                  value={position}
                  onChange={(e) => setposition(e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox checked={remote} onCheckedChange={(v) => setRemote(!!v)} />
                  <span className="select-none text-base">Работаю удаленно</span>
                </label>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Страна</label>
                <select
                  value={country}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCountry(val);
                    // reset city when country changes
                    const nextCities = COUNTRY_MAP[val] ?? [];
                    setCity(nextCities[0] ?? "");
                  }}
                  
                  className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground"
                >
                  <option value="">Выберите страну</option>
                  {Object.keys(COUNTRY_MAP).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Город</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={!country}
                  className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground"
                >
                  <option value="">Выберите город</option>
                  {(COUNTRY_MAP[country] ?? []).map((ct) => (
                    <option key={ct} value={ct}>
                      {ct}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button type="submit" size="lg">
            Следующий шаг
          </Button>
        </div>
      </div>
    </form>
  );
}
