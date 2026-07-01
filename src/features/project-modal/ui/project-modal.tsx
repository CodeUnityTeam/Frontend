import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Icon } from "@iconify/react";

import { Button } from "@/shared/ui/button";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "@/shared/ui/modal/modal";
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
import type { ProjectDetails } from "@/entities/project";
import { createProject, type ProjectStatus } from "@/entities/project/api/create-project";
import { updateProject } from "@/entities/project/api/update-project";

import { projectSchema, type ProjectFormValues } from "../model/schema";

type ProjectModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  project?: ProjectDetails;
};

const STATUS_LABELS: Record<ProjectStatus, string> = {
  draft: "Черновик",
  published: "Опубликован",
  recruiting_closed: "Набор закрыт",
  archived: "В архиве",
  blocked: "Заблокирован",
};

const STATUS_TRANSITIONS: Partial<
  Record<ProjectStatus, Array<{ status: ProjectStatus; label: string }>>
> = {
  draft: [{ status: "published", label: "Опубликовать" }],
  published: [{ status: "recruiting_closed", label: "Закрыть набор" }],
  recruiting_closed: [{ status: "published", label: "Возобновить набор" }],
};

function toIsoDate(ddmmyyyy: string): string {
  const [d, m, y] = ddmmyyyy.split(".");
  return `${y}-${m}-${d}`;
}

function fromIsoDate(iso?: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

export function ProjectModal({
  open,
  onOpenChange,
  mode,
  project,
}: ProjectModalProps) {
  const { data: formats = [] } = useFormats();
  const { data: specs = [] } = useSpecializations();
  const { data: skills = [] } = useSkills();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      shortDesc: "",
      location: "",
      startDate: "",
      endDate: "",
      specializations: [],
      skills: [],
      formatId: "",
    },
  });

  useEffect(() => {
    if (mode === "edit" && project) {
      reset({
        title: project.title,
        shortDesc: project.short_desc,
        location: project.location ?? "",
        startDate: fromIsoDate(project.start_date),
        endDate: fromIsoDate(project.end_date),
        specializations: project.specializations.map((s) => s.name),
        skills: project.skills.map((s) => s.name),
        formatId: project.project_format[0]?.format_id ?? "",
      });
    }
  }, [mode, project, reset]);

  const buildDto = (values: ProjectFormValues, status?: ProjectStatus) => {
    const skillRefs = values.skills
      .map((name) =>
        skills.find((s) => s.name.toLowerCase() === name.toLowerCase()),
      )
      .filter(Boolean)
      .map((s) => ({ skill_id: s!.skillId }));

    const specRefs = values.specializations
      .map((name) =>
        specs.find((s) => s.name.toLowerCase() === name.toLowerCase()),
      )
      .filter(Boolean)
      .map((s) => ({ spec_id: s!.id }));

    return {
      title: values.title,
      short_desc: values.shortDesc,
      location: values.location || undefined,
      start_date: toIsoDate(values.startDate),
      end_date: toIsoDate(values.endDate),
      skills: skillRefs,
      specializations: specRefs,
      project_format: values.formatId ? [values.formatId] : [],
      ...(status ? { status_project: status } : {}),
    };
  };

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      toast.success("Проект создан");
      onOpenChange(false);
    },
    onError: () => toast.error("Не удалось создать проект"),
  });

  const updateMutation = useMutation({
    mutationFn: (dto: ReturnType<typeof buildDto>) =>
      updateProject(project!.project_id, dto),
    onSuccess: () => {
      toast.success("Проект сохранён");
      onOpenChange(false);
    },
    onError: () => toast.error("Не удалось сохранить проект"),
  });

  const statusMutation = useMutation({
    mutationFn: (status: ProjectStatus) =>
      updateProject(project!.project_id, { status_project: status }),
    onSuccess: () => toast.success("Статус обновлён"),
    onError: () => toast.error("Не удалось изменить статус"),
  });

  const onSave = handleSubmit((values) => {
    if (mode === "create") {
      createMutation.mutate(buildDto(values));
    } else {
      updateMutation.mutate(buildDto(values));
    }
  });

  const onPublish = handleSubmit((values) => {
    createMutation.mutate(buildDto(values, "published"));
  });

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    statusMutation.isPending;

  const currentStatus = project?.status_project;
  const transitions = currentStatus ? STATUS_TRANSITIONS[currentStatus] : undefined;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      className="w-[361px] rounded-xl px-4 py-8 sm:w-[560px] sm:px-10 sm:py-10"
    >
      <ModalHeader className="pb-6">
        <ModalTitle>
          {mode === "create" ? "Создание проекта" : "Редактирование проекта"}
        </ModalTitle>
      </ModalHeader>

      <form onSubmit={onSave} className="flex min-h-0 flex-1 flex-col">
        <ModalBody>
          <FieldGroup className="gap-4">
            <Field className="gap-1.5">
              <FieldLabel>Название проекта</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  placeholder="Введите текст"
                  {...register("title")}
                />
              </InputGroup>
              {errors.title && <FieldError>{errors.title.message}</FieldError>}
            </Field>

            <Field className="gap-1.5">
              <FieldLabel>Описание проекта</FieldLabel>
              <InputGroup>
                <InputGroupTextarea
                  className="h-[100px]"
                  placeholder="Начните писать..."
                  {...register("shortDesc")}
                />
              </InputGroup>
              {errors.shortDesc && (
                <FieldError>{errors.shortDesc.message}</FieldError>
              )}
            </Field>

            <Field className="gap-1.5">
              <FieldLabel>Местоположение</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  placeholder="Укажите город"
                  {...register("location")}
                />
                <InputGroupAddon>
                  <Icon
                    icon="ph:map-pin"
                    height={20}
                    className="text-muted-foreground"
                  />
                </InputGroupAddon>
              </InputGroup>
            </Field>

            <div className="flex gap-3">
              <Field className="flex-1 gap-1.5">
                <FieldLabel>Дата начала</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    placeholder="дд.мм.гггг"
                    {...register("startDate")}
                  />
                  <InputGroupAddon>
                    <Icon
                      icon="ph:calendar-dots"
                      height={20}
                      className="text-muted-foreground"
                    />
                  </InputGroupAddon>
                </InputGroup>
                {errors.startDate && (
                  <FieldError>{errors.startDate.message}</FieldError>
                )}
              </Field>

              <Field className="flex-1 gap-1.5">
                <FieldLabel>Дата окончания</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    placeholder="дд.мм.гггг"
                    {...register("endDate")}
                  />
                  <InputGroupAddon>
                    <Icon
                      icon="ph:calendar-dots"
                      height={20}
                      className="text-muted-foreground"
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
                  placeholder="Например: продуктовый дизайнер, разработчик..."
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="skills"
              render={({ field }) => (
                <TagInput
                  label="Теги"
                  placeholder="Добавьте навыки через Enter или пробел"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <Field className="gap-2">
              <FieldLabel>Формат</FieldLabel>
              <Controller
                control={control}
                name="formatId"
                render={({ field }) => (
                  <div className="flex flex-wrap gap-4">
                    {formats.map((f) => (
                      <label
                        key={f.id}
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <input
                          type="radio"
                          className="accent-primary"
                          value={f.id}
                          checked={field.value === f.id}
                          onChange={() => field.onChange(f.id)}
                        />
                        <span className="text-sm">{f.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              />
              {errors.formatId && (
                <FieldError>{errors.formatId.message}</FieldError>
              )}
            </Field>

            {mode === "edit" && currentStatus && (
              <Field className="gap-2">
                <FieldLabel>Статус проекта</FieldLabel>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    {STATUS_LABELS[currentStatus]}
                  </span>
                  {transitions?.map(({ status, label }) => (
                    <Button
                      key={status}
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isPending}
                      onClick={() => statusMutation.mutate(status)}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </Field>
            )}
          </FieldGroup>
        </ModalBody>

        <ModalFooter className="sm:justify-end">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => onOpenChange(false)}
          >
            Отменить
          </Button>

          {mode === "create" ? (
            <>
              <Button
                type="submit"
                variant="outline"
                size="lg"
                disabled={isPending}
              >
                Сохранить
              </Button>
              <Button
                type="button"
                size="lg"
                disabled={isPending}
                onClick={onPublish}
              >
                Опубликовать
              </Button>
            </>
          ) : (
            <Button type="submit" size="lg" disabled={isPending}>
              Сохранить
            </Button>
          )}
        </ModalFooter>
      </form>
    </Modal>
  );
}
