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
  email?: string;
}

export function OnboardingStep1({ data, onNext, onPatch }: StepMeetMeProps) {
  const [name, setName] = useState(data.name);
  const [surname, setSurname] = useState(data.surname);
  const [position, setposition] = useState(data.position);
  const [photo, setPhoto] = useState<File | null>(data.photo);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    data.photo ? URL.createObjectURL(data.photo) : null,
  );
  const [email, setEmail] = useState<string>(data.email ?? "");
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
    // persist photo immediately
    onPatch?.({ photo: file });
  };

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!name.trim()) next.name = "Имя обязательно для заполнения";
    if (!surname.trim()) next.surname = "Фамилия обязательна для заполнения";
    const emailTrim = email.trim();
    if (!emailTrim) next.email = "Email обязателен для заполнения";
    else if (!emailTrim.includes("@")) next.email = "Email должен содержать символ @";
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
      email: email.trim(),
      employmentRole,
      format,
      country,
      city,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <div className="max-w-3xl mx-auto w-full">
        {/* Intro card (outlined white) */}
        <div className="mx-auto border border-border bg-background rounded-[18px] px-6 py-5 sm:px-12 sm:py-6">
          <h1 className="text-3xl sm:text-2xl font-semibold pl-12 sm:pl-16">Познакомимся</h1>
          <p className="mt-2 text-muted-foreground pl-12 sm:pl-16">Это ваш первый шаг к новым проектам и возможностям.</p>
        </div>

        {/* Avatar + form fields */}
        <div className="mt-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="shrink-0 flex flex-col items-center sm:items-start gap-3 w-full sm:w-44">
              <div className="relative">
                <Avatar
                  className="text-2xl cursor-pointer hover:shadow-sm transition-shadow w-52.5 h-52.5 sm:w-33.5 sm:h-33.5"
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
                <div className="text-sm text-muted-foreground">Загрузите фото (JPG, PNG, WEBP)</div>
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
                    className="h-14 rounded-[14px]"
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
                    className="h-14 rounded-[14px]"
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
                    className="h-14 rounded-[14px]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <Input
                    label="Email"
                    placeholder="your@email.com"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                      onPatch?.({ email: e.target.value });
                    }}
                    error={errors.email}
                    className="h-14 rounded-[14px]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <div className="mb-2 text-sm font-medium">Я хочу</div>
                  <div className="flex items-center gap-4">
                    <label
                      className={`inline-flex items-center gap-2 cursor-pointer rounded-md px-2 py-2 flex-1 min-w-0 ${
                        employmentRole === "worker" ? "ring-2 ring-primary" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="employmentRole"
                        value="worker"
                        checked={employmentRole === "worker"}
                        onChange={() => {
                          setEmploymentRole("worker");
                          onPatch?.({ employmentRole: "worker" });
                        }}
                        className="h-4 w-4 align-middle shrink-0"
                      />
                      <span className="text-sm sm:text-base font-medium tracking-tight leading-none truncate">Найти работу</span>
                    </label>

                    <label
                      className={`inline-flex items-center gap-2 cursor-pointer rounded-md px-2 py-2 flex-1 min-w-0 ${
                        employmentRole === "employer" ? "ring-2 ring-primary" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="employmentRole"
                        value="employer"
                        checked={employmentRole === "employer"}
                        onChange={() => {
                          setEmploymentRole("employer");
                          onPatch?.({ employmentRole: "employer" });
                        }}
                        className="h-4 w-4 align-middle shrink-0"
                      />
                      <span className="text-sm sm:text-base font-medium tracking-tight leading-none truncate">Найти сотрудников</span>
                    </label>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <div className="mb-2 text-sm font-medium">Формат</div>
                  <div className="flex items-center gap-4">
                    <label className="inline-flex items-center gap-2 cursor-pointer rounded-md px-2 py-2 flex-1 min-w-0">
                      <input
                        type="radio"
                        name="format"
                        value="remote"
                        checked={format === "remote"}
                        onChange={() => {
                          setFormat("remote");
                          onPatch?.({ format: "remote" });
                        }}
                        className="h-4 w-4 align-middle shrink-0"
                      />
                      <span className="text-sm sm:text-base font-medium tracking-tight leading-none truncate">Удалённо</span>
                    </label>

                    <label className="inline-flex items-center gap-2 cursor-pointer rounded-md px-2 py-2 flex-1 min-w-0">
                      <input
                        type="radio"
                        name="format"
                        value="hybrid"
                        checked={format === "hybrid"}
                        onChange={() => {
                          setFormat("hybrid");
                          onPatch?.({ format: "hybrid" });
                        }}
                        className="h-4 w-4 align-middle shrink-0"
                      />
                      <span className="text-sm sm:text-base font-medium tracking-tight leading-none truncate">Гибрид</span>
                    </label>

                    <label className="inline-flex items-center gap-2 cursor-pointer rounded-md px-2 py-2 flex-1 min-w-0">
                      <input
                        type="radio"
                        name="format"
                        value="office"
                        checked={format === "office"}
                        onChange={() => {
                          setFormat("office");
                          onPatch?.({ format: "office" });
                        }}
                        className="h-4 w-4 align-middle shrink-0"
                      />
                      <span className="text-sm sm:text-base font-medium tracking-tight leading-none truncate">В офисе</span>
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
                    className="w-full rounded-[14px] border border-border px-4 py-3 bg-background text-foreground h-14"
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
                    className="w-full rounded-[14px] border border-border px-4 py-3 bg-background text-foreground h-14"
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

          <div className="mt-6 flex justify-stretch sm:justify-end">
            <Button type="submit" size="lg" className="w-full sm:w-auto">
              Следующий шаг
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
