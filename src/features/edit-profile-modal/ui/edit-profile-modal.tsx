import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Icon } from "@/shared/ui/icon";
import { Label } from "@/shared/ui/label";
import { Modal } from "@/shared/ui/modal/modal";
import { DialogClose } from "@/shared/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { cn } from "@/shared/lib/utils";

import type { EditProfileFormData } from "../model/types";
import {
  firstNameRules,
  lastNameRules,
  countryRules,
  cityRules,
  roleRules,
  formatRules,
} from "../model/validation";
import { useProfile, useUpdateProfile } from "../model/use-edit-profile";

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileModal({
  open,
  onOpenChange,
}: EditProfileModalProps) {
  const { data: userData, isLoading } = useProfile();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<EditProfileFormData>({
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      position: "",
      role: "worker",
      country: "",
      city: "",
      format: "",
    },
  });

  useEffect(() => {
    if (!userData || !open) return;

    reset({
      firstName: userData.first_name ?? "",
      lastName: userData.last_name ?? "",
      position: userData.experiences?.[0]?.position ?? "",
      role: userData.projects_relation ?? "worker",
      country: userData.country ?? "",
      city: userData.city ?? "",
      format: userData.workformats?.[0]?.format_id ?? "",
    });
  }, [userData, open, reset]);

  const submit = handleSubmit((values) => {
    if (!userData) return;

    const payload = {
      first_name: values.firstName,
      last_name: values.lastName,
      projects_relation: values.role as "employer" | "worker",
      phone_number: userData.phone_number || "",
      additional_contact: userData.additional_contact || "",
      country: values.country,
      city: values.city,
      soft_skills: userData.soft_skills || "",
      about_me: userData.about_me || "",
      avatar_url: userData.avatar_url || "",
      skills: userData.skills.map((s) => ({ skill_id: s.skill_id })),
      specializations: userData.specializations.map((s) => ({
        spec_id: s.spec_id,
      })),
      workformats: values.format
        ? [{ format_id: values.format }]
        : userData.workformats.map((f) => ({ format_id: f.format_id })),
    };

    updateProfile(payload, {
      onSuccess: () => {
        alert("Профиль успешно обновлен!");
        onOpenChange(false);
      },
      onError: (error) => {
        console.error("Error updating profile:", error);
        alert("Произошла ошибка при обновлении профиля");
      },
    });
  });

  if (isLoading) {
    return null;
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      closeOnOutsideClick={false}
      className={cn(
        "gap-0 p-4 sm:p-6 md:p-8",
        "max-w-[365px] sm:max-w-[694px]",
        "w-[365px] sm:w-[694px]",
        "h-auto sm:h-[770px]",
        "rounded-xl sm:rounded-xl",
        "max-h-[90vh] overflow-y-auto"
      )}
    >
      <div className="flex justify-end">
        <DialogClose
          aria-label="Закрыть"
          className="cursor-pointer bg-transparent p-0 ring-0 outline-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none"
        >
          <Icon name="ph:x" size={28} />
        </DialogClose>
      </div>

      <form onSubmit={submit} noValidate className="-mt-px flex h-full flex-col">
       
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <div className="flex justify-center sm:block sm:shrink-0">
            <img
              src={userData?.avatar_url || "https://i.pravatar.cc/150?img=47"}
              alt="avatar"
              className="size-24 rounded-full object-cover sm:size-32"
            />
          </div>

          <div className="flex flex-1 flex-col gap-4 sm:gap-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Controller
                name="firstName"
                control={control}
                rules={firstNameRules}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    label="Имя"
                    placeholder="Введите имя"
                    error={fieldState.error?.message}
                    className="h-12 rounded-xl sm:h-15 sm:rounded-xl"
                  />
                )}
              />

              <Controller
                name="lastName"
                control={control}
                rules={lastNameRules}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    label="Фамилия"
                    placeholder="Введите фамилию"
                    error={fieldState.error?.message}
                    className="h-12 rounded-xl sm:h-15 sm:rounded-xl"
                  />
                )}
              />
            </div>

            <Controller
              name="position"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Занимаемая должность"
                  placeholder="Занимаемая должность"
                  className="h-12 rounded-xl sm:h-15 sm:rounded-xl"
                />
              )}
            />
          </div>
        </div>

       
        <div className="flex flex-col gap-2">
          <Label className="-mt-0.5 text-[20px] font-medium max-sm:text-base">
            Роль
          </Label>

          <Controller
            name="role"
            control={control}
            rules={roleRules}
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="flex gap-3 max-sm:gap-4"
              >
                <div className="flex items-center gap-3 max-sm:gap-2">
                  <RadioGroupItem value="worker" id="worker" />
                  <Label
                    htmlFor="worker"
                    className="text-[18px] font-normal max-sm:text-sm"
                  >
                    Сотрудник
                  </Label>
                </div>

                <div className="flex items-center gap-3 max-sm:gap-2">
                  <RadioGroupItem value="employer" id="employer" />
                  <Label
                    htmlFor="employer"
                    className="text-[18px] font-normal max-sm:text-sm"
                  >
                    Работодатель
                  </Label>
                </div>
              </RadioGroup>
            )}
          />
        </div>

      
        <div className="mt-4 max-sm:mt-3">
          <Controller
            name="country"
            control={control}
            rules={countryRules}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                label="Страна"
                placeholder="Страна проживания"
                error={fieldState.error?.message}
                className="h-15 rounded-xl max-sm:h-12 sm:rounded-xl"
              />
            )}
          />
        </div>

      
        <div className="mt-4 max-sm:mt-3">
          <Controller
            name="city"
            control={control}
            rules={cityRules}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                label="Город"
                placeholder="Город проживания"
                error={fieldState.error?.message}
                className="h-15 rounded-xl max-sm:h-12 sm:rounded-xl"
              />
            )}
          />
        </div>

        
        <div className="mt-3 flex flex-col gap-3 max-sm:gap-2">
          <Label className="text-[20px] font-medium max-sm:text-base">
            Формат
          </Label>

          <Controller
            name="format"
            control={control}
            rules={formatRules}
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="flex gap-3 max-sm:flex-wrap max-sm:gap-2"
              >
                <div className="flex items-center gap-3 max-sm:gap-2">
                  <RadioGroupItem value="remote" id="remote" />
                  <Label
                    htmlFor="remote"
                    className="text-[18px] font-normal max-sm:text-sm"
                  >
                    Удалённо
                  </Label>
                </div>

                <div className="flex items-center gap-3 max-sm:gap-2">
                  <RadioGroupItem value="hybrid" id="hybrid" />
                  <Label
                    htmlFor="hybrid"
                    className="text-[18px] font-normal max-sm:text-sm"
                  >
                    Гибрид
                  </Label>
                </div>

                <div className="flex items-center gap-3 max-sm:gap-2">
                  <RadioGroupItem value="office" id="office" />
                  <Label
                    htmlFor="office"
                    className="text-[18px] font-normal max-sm:text-sm"
                  >
                    В офисе
                  </Label>
                </div>
              </RadioGroup>
            )}
          />
        </div>

        {/* Кнопка сохранить */}
        <div className="mt-6 flex justify-center pt-4 sm:mt-auto sm:pt-8">
          <Button
            type="submit"
            disabled={!isValid || isPending}
            className="h-13 w-full rounded-xl px-8 text-base sm:h-13 sm:w-36 sm:rounded-xl sm:px-8 sm:text-[18px]"
          >
            {isPending ? "Сохранение..." : "Сохранить"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}