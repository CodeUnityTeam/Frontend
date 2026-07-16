import { useEffect, useMemo, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
} from "@/shared/ui/modal/modal";
import {
  AlertModal,
  AlertModalHeader,
  AlertModalTitle,
  AlertModalDescription,
  AlertModalFooter,
  AlertModalAction,
  AlertModalCancel,
} from "@/shared/ui/modal/alert-modal";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/shared/ui/field";
import {
  InputGroup,
  InputGroupInput,
  InputGroupTextarea,
  InputGroupAddon,
} from "@/shared/ui/input/input-group";
import { TagInput } from "@/shared/ui/tag-input";

import { useFormats, useSpecializations } from "@/entities/reference";
import { useSkills } from "@/entities/skill";
import {
  useCreateProject,
  useUpdateProject,
  type CreateProjectDto,
  type ProjectDetails,
} from "@/entities/project";

import { projectSchema, type ProjectFormValues } from "../model/schema";

type ProjectModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  project?: ProjectDetails;
};

const EMPTY_VALUES: ProjectFormValues = {
  title: "",
  shortDesc: "",
  location: "",
  startDate: "",
  endDate: "",
  specializations: [],
  skills: [],
  formatId: "",
};

function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function toDateValue(iso?: string | null): string {
  return iso ? iso.slice(0, 10) : "";
}

function openDatePicker(event: React.MouseEvent<HTMLInputElement>) {
  event.currentTarget.showPicker?.();
}

function openDatePickerFromAddon(event: React.MouseEvent<HTMLDivElement>) {
  event.currentTarget.parentElement?.querySelector("input")?.showPicker?.();
}

const fieldControlClass = "h-auto p-4 text-lg";
const dateControlClass = cn(
  fieldControlClass,
  "[&::-webkit-calendar-picker-indicator]:hidden",
);

export function ProjectModal({
  open,
  onOpenChange,
  mode,
  project,
}: ProjectModalProps) {
  const { data: formats = [] } = useFormats();
  const { data: specs = [] } = useSpecializations();
  const { data: skills = [] } = useSkills();

  const [isConfirmCloseOpen, setConfirmCloseOpen] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && project) {
      reset({
        title: project.title,
        shortDesc: project.short_desc,
        location: project.location ?? "",
        startDate: toDateValue(project.start_date),
        endDate: toDateValue(project.end_date),
        specializations: project.specializations.map((s) => s.name),
        skills: project.skills.map((s) => s.name),
        formatId: project.project_format[0]?.format_id ?? "",
      });
    } else {
      reset(EMPTY_VALUES);
    }
  }, [open, mode, project, reset]);

  const startDate = useWatch({ control, name: "startDate" });
  const endDate = useWatch({ control, name: "endDate" });

  const canEditStartDate =
    mode === "create" || project?.status_project === "draft";

  const specNames = useMemo(() => specs.map((s) => s.name), [specs]);
  const skillNames = useMemo(() => skills.map((s) => s.name), [skills]);

  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();

  const isPending = createMutation.isPending || updateMutation.isPending;

  const resolveCatalogRefs = (
    values: ProjectFormValues,
  ): Pick<CreateProjectDto, "skills" | "specializations"> | null => {
    const findSpec = (name: string) =>
      specs.find((s) => s.name.toLowerCase() === name.toLowerCase());
    const findSkill = (name: string) =>
      skills.find((s) => s.name.toLowerCase() === name.toLowerCase());

    const unknownSpecs = values.specializations.filter(
      (name) => !findSpec(name),
    );
    const unknownSkills = values.skills.filter((name) => !findSkill(name));

    if (unknownSpecs.length > 0) {
      setError("specializations", {
        type: "manual",
        message: `Выберите позиции из списка: ${unknownSpecs.join(", ")}`,
      });
    }
    if (unknownSkills.length > 0) {
      setError("skills", {
        type: "manual",
        message: `Выберите теги из списка: ${unknownSkills.join(", ")}`,
      });
    }
    if (unknownSpecs.length > 0 || unknownSkills.length > 0) {
      return null;
    }

    return {
      specializations: values.specializations.map((name) => ({
        spec_id: findSpec(name)!.id,
      })),
      skills: values.skills.map((name) => ({
        skill_id: findSkill(name)!.skillId,
      })),
    };
  };

  const onSubmit = handleSubmit((values) => {
    const refs = resolveCatalogRefs(values);
    if (!refs) return;

    const dto: CreateProjectDto = {
      title: values.title,
      short_desc: values.shortDesc,
      location: values.location,
      end_date: values.endDate,
      project_format: [values.formatId],
      ...refs,
      ...(canEditStartDate && values.startDate
        ? { start_date: values.startDate }
        : {}),
    };

    if (mode === "create") {
      createMutation.mutate(
        { ...dto, status_project: "published" },
        { onSuccess: () => onOpenChange(false) },
      );
    } else if (project) {
      updateMutation.mutate(
        { projectId: project.project_id, dto },
        { onSuccess: () => onOpenChange(false) },
      );
    }
  });

  const requestClose = () => {
    if (isDirty) {
      setConfirmCloseOpen(true);
      return;
    }
    onOpenChange(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      requestClose();
      return;
    }
    onOpenChange(nextOpen);
  };

  const confirmClose = () => {
    setConfirmCloseOpen(false);
    onOpenChange(false);
  };

  return (
    <>
      <Modal
        open={open}
        onOpenChange={handleOpenChange}
        className="max-w-full p-4 max-sm:h-dvh max-sm:max-h-dvh max-sm:rounded-none sm:max-w-167 sm:px-8 sm:pt-6 sm:pb-5"
      >
        <ModalHeader>
          <ModalTitle>
            {mode === "create" ? "Создание проекта" : "Редактирование проекта"}
          </ModalTitle>
          <ModalDescription className="sr-only">
            {mode === "create"
              ? "Форма создания нового проекта: название, описание, сроки и требуемые навыки"
              : "Форма редактирования проекта: название, описание, сроки и требуемые навыки"}
          </ModalDescription>
        </ModalHeader>

        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <ModalBody>
            <FieldGroup className="gap-4 sm:gap-6">
              <Field className="gap-1">
                <FieldLabel className="max-sm:text-lg">
                  Название проекта
                </FieldLabel>
                <InputGroup className="rounded-lg">
                  <InputGroupInput
                    placeholder="Введите текст"
                    className={fieldControlClass}
                    {...register("title")}
                  />
                </InputGroup>
                {errors.title && (
                  <FieldError>{errors.title.message}</FieldError>
                )}
              </Field>

              <Field className="gap-1">
                <FieldLabel className="max-sm:text-lg">
                  Описание проекта
                </FieldLabel>
                <InputGroup className="rounded-lg">
                  <InputGroupTextarea
                    placeholder="Начните писать..."
                    className={cn(fieldControlClass, "min-h-25")}
                    {...register("shortDesc")}
                  />
                </InputGroup>
                {errors.shortDesc && (
                  <FieldError>{errors.shortDesc.message}</FieldError>
                )}
              </Field>

              <Field className="gap-1">
                <FieldLabel className="max-sm:text-lg">
                  Местоположение
                </FieldLabel>
                <InputGroup className="rounded-lg">
                  <InputGroupInput
                    placeholder="Укажите город"
                    className={fieldControlClass}
                    {...register("location")}
                  />
                  <InputGroupAddon align="inline-end" className="pr-4">
                    <Icon
                      icon="ph:map-pin"
                      className="size-6 text-muted-foreground"
                    />
                  </InputGroupAddon>
                </InputGroup>
                {errors.location && (
                  <FieldError>{errors.location.message}</FieldError>
                )}
              </Field>

              <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
                <Field className="flex-1 gap-1">
                  <FieldLabel className="max-sm:text-lg">
                    Дата начала проекта
                  </FieldLabel>
                  <InputGroup className="rounded-lg">
                    <InputGroupInput
                      type="date"
                      min={canEditStartDate ? todayIso() : undefined}
                      readOnly={!canEditStartDate}
                      onClick={canEditStartDate ? openDatePicker : undefined}
                      className={cn(
                        dateControlClass,
                        !startDate && "text-muted-foreground",
                        !canEditStartDate && "opacity-60",
                      )}
                      {...register("startDate")}
                    />
                    {canEditStartDate && (
                      <InputGroupAddon
                        align="inline-end"
                        className="pr-4"
                        onClick={openDatePickerFromAddon}
                      >
                        <Icon
                          icon="ph:calendar-dots"
                          className="size-6 text-muted-foreground"
                        />
                      </InputGroupAddon>
                    )}
                  </InputGroup>
                  {!canEditStartDate && (
                    <p className="text-sm text-muted-foreground">
                      Дату начала нельзя изменить после публикации
                    </p>
                  )}
                  {errors.startDate && (
                    <FieldError>{errors.startDate.message}</FieldError>
                  )}
                </Field>

                <Field className="flex-1 gap-1">
                  <FieldLabel className="max-sm:text-lg">
                    Дата окончания проекта
                  </FieldLabel>
                  <InputGroup className="rounded-lg">
                    <InputGroupInput
                      type="date"
                      min={startDate || todayIso()}
                      onClick={openDatePicker}
                      className={cn(
                        dateControlClass,
                        !endDate && "text-muted-foreground",
                      )}
                      {...register("endDate")}
                    />
                    <InputGroupAddon
                      align="inline-end"
                      className="pr-4"
                      onClick={openDatePickerFromAddon}
                    >
                      <Icon
                        icon="ph:calendar-dots"
                        className="size-6 text-muted-foreground"
                      />
                    </InputGroupAddon>
                  </InputGroup>
                  {errors.endDate && (
                    <FieldError>{errors.endDate.message}</FieldError>
                  )}
                </Field>
              </div>

              <Controller
                control={control}
                name="specializations"
                render={({ field }) => (
                  <TagInput
                    label="Позиция"
                    placeholder="Например, продуктовый дизайнер, разработчик..."
                    suggestions={specNames}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.specializations?.message}
                    groupClassName="rounded-lg"
                    inputClassName="text-lg"
                    className="md:gap-1"
                  />
                )}
              />

              <Controller
                control={control}
                name="skills"
                render={({ field }) => (
                  <TagInput
                    label="Теги"
                    placeholder="Например, JavaScript, Python, Figma..."
                    suggestions={skillNames}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.skills?.message}
                    groupClassName="rounded-lg"
                    inputClassName="text-lg"
                    className="md:gap-1"
                  />
                )}
              />

              <Field className="gap-3">
                <FieldLabel className="max-sm:text-lg">Формат</FieldLabel>
                <Controller
                  control={control}
                  name="formatId"
                  render={({ field }) => (
                    <div className="flex flex-wrap gap-4">
                      {formats.map((format) => (
                        <label
                          key={format.id}
                          className="flex cursor-pointer items-center gap-2"
                        >
                          <input
                            type="radio"
                            name="project-format"
                            className="peer sr-only"
                            value={format.id}
                            checked={field.value === format.id}
                            onChange={() => field.onChange(format.id)}
                          />
                          <span className="flex size-7 items-center justify-center rounded-full border border-input bg-background transition-colors peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100">
                            <Icon
                              icon="ph:check"
                              className="size-5 text-primary-foreground"
                            />
                          </span>
                          <span className="text-lg">{format.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                />
                {errors.formatId && (
                  <FieldError>{errors.formatId.message}</FieldError>
                )}
              </Field>
            </FieldGroup>
          </ModalBody>

          <ModalFooter>
            <Button
              type="submit"
              size="lg"
              className="flex-1"
              disabled={isPending}
            >
              {mode === "create" ? "Опубликовать" : "Сохранить"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1"
              disabled={isPending}
              onClick={requestClose}
            >
              Отменить
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      <AlertModal open={isConfirmCloseOpen} onOpenChange={setConfirmCloseOpen}>
        <AlertModalHeader className="gap-2">
          <Icon icon="ph:warning-circle" className="size-16 text-foreground" />
          <AlertModalTitle>Закрыть форму?</AlertModalTitle>
          <AlertModalDescription className="text-base">
            Это действие приведёт к безвозвратному удалению всех несохранённых
            изменений
          </AlertModalDescription>
        </AlertModalHeader>
        <AlertModalFooter>
          <AlertModalAction onClick={confirmClose}>Закрыть</AlertModalAction>
          <AlertModalCancel>Отменить</AlertModalCancel>
        </AlertModalFooter>
      </AlertModal>
    </>
  );
}
