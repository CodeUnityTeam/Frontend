import { useRef, useState, useEffect } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
// Checkbox removed: replaced by radio group
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
    // persist photo immediately
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
      format,
      country,
      city,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <div className="max-w-3xl mx-auto w-full">
        <div className="mb-2">
          <h1 className="text-2xl font-semibold">Познакомимся</h1>
          <p className="mt-1 text-muted-foreground">Это ваш первый шаг к новым проектам и возможностям.</p>
        </div>

        <div className="bg-card/50 p-8 rounded-lg">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="shrink-0 flex flex-col items-center sm:items-start gap-3 w-full sm:w-44">
              <div className="relative">
              <Avatar
                className="text-2xl cursor-pointer hover:shadow-sm transition-shadow w-[134px] h-[134px]"
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
                          className="w-full h-full object-contain"
                          aria-hidden
                        />
                      );
                    })()}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
            <div className="flex flex-col items-center sm:items-start gap-2">
              <div className="text-sm text-muted-foreground">Размер: 134×134 • JPG, PNG, WEBP</div>
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
                    onPatch?.({ name: e.target.value });
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
                    onPatch?.({ surname: e.target.value });
                  }}
                  error={errors.surname}
                />
              </div>

              <div className="sm:col-span-2">
                <Input
                  label="Должность"
                  placeholder="Занимаемая должность"
                  value={position}
                  onChange={(e) => {
                    setposition(e.target.value);
                    onPatch?.({ position: e.target.value });
                  }}
                />
              </div>

              <div className="sm:col-span-2">
                <div className="mb-2 text-sm font-medium">Формат</div>
                <div className="flex items-center gap-6">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="format"
                      value="remote"
                      checked={format === "remote"}
                      onChange={() => {
                        setFormat("remote");
                        onPatch?.({ format: "remote" });
                      }}
                      className="h-4 w-4"
                    />
                    <span className="text-base">Удалённо</span>
                  </label>

                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="format"
                      value="hybrid"
                      checked={format === "hybrid"}
                      onChange={() => {
                        setFormat("hybrid");
                        onPatch?.({ format: "hybrid" });
                      }}
                      className="h-4 w-4"
                    />
                    <span className="text-base">Гибрид</span>
                  </label>

                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="format"
                      value="office"
                      checked={format === "office"}
                      onChange={() => {
                        setFormat("office");
                        onPatch?.({ format: "office" });
                      }}
                      className="h-4 w-4"
                    />
                    <span className="text-base">В офисе</span>
                  </label>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm font-medium mb-1 block">Страна</label>
                <select
                  value={country}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCountry(val);
                    // reset city when country changes
                    const nextCities = COUNTRY_MAP[val] ?? [];
                    const nextCity = nextCities[0] ?? "";
                    setCity(nextCity);
                    onPatch?.({ country: val, city: nextCity });
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

              <div className="sm:col-span-2">
                <label className="text-sm font-medium mb-1 block">Город</label>
                <select
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    onPatch?.({ city: e.target.value });
                  }}
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
      </div>
    </form>
  );
}
