import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { useCurrentProfile } from "@/entities/profile";
import {
  resolveReferenceIds,
  useFormats,
  useSpecializations,
} from "@/entities/reference";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Modal,
  ModalBody,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/shared/ui/modal/modal";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { TagInput } from "@/shared/ui/tag-input";
import { useSaveProfileHeader } from "@/widgets/account/model/use-save-profile-header";

const AVATAR_ALLOWED_TYPES = ["image/jpeg", "image/png"];
const AVATAR_MAX_SIZE = 10 * 1024 * 1024;

interface ProfileHeaderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ProfileHeaderFormValues {
  firstName: string;
  lastName: string;
  specializations: string[];
  format: string;
  country: string;
  city: string;
}

export function ProfileHeaderModal({
  open,
  onOpenChange,
}: ProfileHeaderModalProps) {
  const profile = useCurrentProfile().data;
  const formatsQuery = useFormats();
  const specializationsQuery = useSpecializations();
  const saveProfileHeader = useSaveProfileHeader();

  const specializationNames = (specializationsQuery.data ?? []).map(
    (item) => item.name,
  );

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const avatarPreview = useMemo(
    () => (avatarFile ? URL.createObjectURL(avatarFile) : ""),
    [avatarFile],
  );

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const shownAvatar =
    avatarPreview || (removeAvatar ? "" : (profile?.avatar_url ?? ""));

  const {
    control,
    handleSubmit,
    setError,
    formState: { isValid },
  } = useForm<ProfileHeaderFormValues>({
    mode: "onTouched",
    defaultValues: {
      firstName: profile?.first_name ?? "",
      lastName: profile?.last_name ?? "",
      specializations: profile?.specializations.map((item) => item.name) ?? [],
      format: profile?.workformats[0]?.format_id ?? "",
      country: profile?.country ?? "",
      city: profile?.city ?? "",
    },
  });

  const handleAvatarPick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }
    if (!AVATAR_ALLOWED_TYPES.includes(file.type)) {
      setAvatarError("Подойдёт изображение JPEG или PNG");
      return;
    }
    if (file.size > AVATAR_MAX_SIZE) {
      setAvatarError("Размер файла — не больше 10 МБ");
      return;
    }
    setAvatarError("");
    setRemoveAvatar(false);
    setAvatarFile(file);
  };

  const handleAvatarRemove = () => {
    setAvatarFile(null);
    setRemoveAvatar(true);
    setAvatarError("");
  };

  const submit = handleSubmit((values) => {
    const { ids: specializationIds, unknown } = resolveReferenceIds(
      values.specializations,
      specializationsQuery.data ?? [],
    );

    if (unknown.length > 0) {
      setError("specializations", {
        message: `Нет в справочнике специализаций: ${unknown.join(", ")}`,
      });
      return;
    }

    saveProfileHeader.mutate(
      {
        profile: {
          first_name: values.firstName.trim(),
          last_name: values.lastName.trim(),
          country: values.country.trim(),
          city: values.city.trim(),
          specializations: specializationIds,
          workformats: values.format ? [values.format] : [],
        },
        avatarFile,

        removeAvatar: removeAvatar && Boolean(profile?.avatar_url),
      },
      {
        onSuccess: () => {
          toast.success("Профиль обновлён");
          onOpenChange(false);
        },
      },
    );
  });

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      className="rounded-[20px] sm:max-w-178"
    >
      <ModalHeader>
        <ModalTitle className="sr-only">Редактирование профиля</ModalTitle>
        <ModalDescription className="sr-only">
          Форма редактирования имени, должности, формата работы и места
          проживания
        </ModalDescription>
      </ModalHeader>

      <ModalBody>
        <form id="profile-header-form" onSubmit={submit} noValidate>
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
            <div className="flex flex-col items-center gap-2 sm:shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Загрузить фото профиля"
                className="cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {shownAvatar ? (
                  <img
                    src={shownAvatar}
                    alt="Фото профиля"
                    className="size-24 rounded-full object-cover sm:size-32"
                  />
                ) : (
                  <span className="grid size-24 place-content-center rounded-full bg-secondary text-muted-foreground sm:size-32">
                    <Icon icon="ph:user" className="size-10" />
                  </span>
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleAvatarPick}
                className="hidden"
              />

              {shownAvatar && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleAvatarRemove}
                  className="text-muted-foreground"
                >
                  Удалить фото
                </Button>
              )}

              {avatarError && (
                <p className="max-w-32 text-center text-sm text-destructive">
                  {avatarError}
                </p>
              )}
            </div>

            <div className="flex flex-1 flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Controller
                  name="firstName"
                  control={control}
                  rules={{ required: "Введите имя" }}
                  render={({ field, fieldState }) => (
                    <Input
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      placeholder="Имя"
                      autoComplete="given-name"
                      error={fieldState.error?.message}
                    />
                  )}
                />

                <Controller
                  name="lastName"
                  control={control}
                  rules={{ required: "Введите фамилию" }}
                  render={({ field, fieldState }) => (
                    <Input
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      placeholder="Фамилия"
                      autoComplete="family-name"
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </div>

              <Controller
                name="specializations"
                control={control}
                render={({ field, fieldState }) => (
                  <TagInput
                    placeholder="Занимаемая должность"
                    value={field.value}
                    onChange={field.onChange}
                    suggestions={specializationNames}
                    error={fieldState.error?.message}
                  />
                )}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Label className="text-[20px] font-medium">Формат</Label>

            <Controller
              name="format"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex flex-wrap gap-4"
                >
                  {(formatsQuery.data ?? []).map((format) => (
                    <div key={format.id} className="flex items-center gap-3">
                      <RadioGroupItem value={format.id} id={format.id} />
                      <Label htmlFor={format.id} className="font-normal">
                        {format.name}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />
          </div>

          <div className="mt-6 flex flex-col gap-6">
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <Input
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  label="Страна"
                  placeholder="Страна проживания"
                />
              )}
            />

            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <Input
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  label="Город"
                  placeholder="Город проживания"
                />
              )}
            />
          </div>
        </form>
      </ModalBody>

      <ModalFooter>
        <Button
          type="submit"
          form="profile-header-form"
          size="lg"
          disabled={
            !isValid ||
            saveProfileHeader.isPending ||
            specializationsQuery.isPending
          }
        >
          {saveProfileHeader.isPending ? "Сохранение..." : "Сохранить"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
