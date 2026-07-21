import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { useUpdateProfile } from "@/entities/profile";
import { resolveReferenceIds } from "@/entities/reference";
import { useSkills } from "@/entities/skill";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
} from "@/shared/ui/dialog";
import { TextInput } from "@/shared/ui/text-input";
import { TagInput } from "@/shared/ui/tag-input";

interface SkillsFormValues {
  skills: string[];
  qualities: string[];
  about: string;
}

type SetSkillsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues: SkillsFormValues;
};

export function SetSkillsModal({
  open,
  onOpenChange,
  defaultValues,
}: SetSkillsModalProps) {
  const skillsQuery = useSkills();
  const updateProfile = useUpdateProfile();

  const { control, handleSubmit, setError } = useForm<SkillsFormValues>({
    mode: "onTouched",
    defaultValues,
  });

  const catalog = (skillsQuery.data ?? []).map((skill) => ({
    id: skill.skillId,
    name: skill.name,
  }));
  const skillNames = catalog.map((skill) => skill.name);

  const submit = handleSubmit((values) => {
    const { ids: skillIds, unknown } = resolveReferenceIds(
      values.skills,
      catalog,
    );

    if (unknown.length > 0) {
      setError("skills", {
        message: `Нет в каталоге навыков: ${unknown.join(", ")}`,
      });
      return;
    }

    updateProfile.mutate(
      {
        skills: skillIds,
        soft_skills: values.qualities
          .map((quality) => quality.trim())
          .filter(Boolean)
          .join(", "),
        about_me: values.about.trim(),
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay />
      <DialogContent className="mx-auto p-4 pbs-12 md:max-w-[714px] md:p-8 md:pbs-16">
        <DialogTitle className="sr-only">Форма навыков</DialogTitle>
        <DialogDescription className="sr-only">
          Форма заполнения навыков, личных качеств и информации о себе
        </DialogDescription>
        <form
          onSubmit={submit}
          noValidate
          className="flex flex-col gap-4 md:gap-6"
        >
          <Controller
            name="skills"
            control={control}
            render={({ field, fieldState }) => (
              <TagInput
                label="Навыки и инструменты"
                placeholder="Начните вводить здесь"
                description="Выберите программы, которыми вы владеете"
                value={field.value}
                onChange={field.onChange}
                suggestions={skillNames}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="qualities"
            control={control}
            render={({ field }) => (
              <TagInput
                label="Личные качества"
                placeholder="Ваши преимущества"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name="about"
            control={control}
            render={({ field }) => (
              <TextInput
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                label="О себе"
                placeholder="Расскажите о себе"
              />
            )}
          />
          <Button
            type="submit"
            variant="default"
            disabled={updateProfile.isPending || skillsQuery.isPending}
            className="w-full self-center md:mbs-6 md:max-w-33"
          >
            {updateProfile.isPending ? "Сохранение..." : "Сохранить"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
