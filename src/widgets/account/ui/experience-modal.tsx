import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { useCreateExperience, useUpdateExperience } from "@/entities/profile";
import type { ExperienceCreateRequest } from "@/shared/api/profile";
import { Button } from "@/shared/ui/button";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/shared/ui/modal/modal";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import type { ExperienceItem } from "@/widgets/account/model/types";

interface ExperienceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experience?: ExperienceItem;
}

interface ExperienceFormValues {
  company: string;
  position: string;
  responsibilities: string;
  startDate: string;
  endDate: string;
}

export const ExperienceModal = ({
  open,
  onOpenChange,
  experience,
}: ExperienceModalProps) => {
  const createExperience = useCreateExperience();
  const updateExperience = useUpdateExperience();
  const isPending = createExperience.isPending || updateExperience.isPending;

  const { control, handleSubmit, getValues } = useForm<ExperienceFormValues>({
    mode: "onTouched",
    defaultValues: {
      company: experience?.company ?? "",
      position: experience?.position ?? "",
      responsibilities: experience?.responsibilities ?? "",
      startDate: experience?.startDate?.slice(0, 10) ?? "",
      endDate: experience?.endDate?.slice(0, 10) ?? "",
    },
  });

  const submit = handleSubmit((values) => {
    const payload: ExperienceCreateRequest = {
      company: values.company.trim(),
      position: values.position.trim(),
      responsibilities: values.responsibilities.trim(),
      start_date: values.startDate,
      end_date: values.endDate || null,
    };

    const onSuccess = () => {
      toast.success("Опыт работы сохранён");
      onOpenChange(false);
    };

    if (experience?.id) {
      updateExperience.mutate({ id: experience.id, payload }, { onSuccess });
    } else {
      createExperience.mutate(payload, { onSuccess });
    }
  });

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      className="rounded-[20px] sm:max-w-178"
    >
      <ModalHeader>
        <ModalTitle className="sr-only">Опыт работы</ModalTitle>
      </ModalHeader>

      <ModalBody>
        <form id="experience-form" onSubmit={submit} noValidate>
          <div className="flex flex-col gap-4 sm:gap-7">
            <Controller
              name="company"
              control={control}
              rules={{ required: "Введите название компании" }}
              render={({ field, fieldState }) => (
                <Input
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  label="Название компании"
                  placeholder="Например Яндекс"
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="position"
              control={control}
              rules={{ required: "Введите должность" }}
              render={({ field, fieldState }) => (
                <Input
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  label="Должность"
                  placeholder="Например Дизайнер"
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="responsibilities"
              control={control}
              render={({ field }) => (
                <Textarea
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  label="Обязанности"
                  placeholder="Распишите подробно свои обязанности"
                />
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
              <Controller
                name="startDate"
                control={control}
                rules={{ required: "Введите дату начала", deps: ["endDate"] }}
                render={({ field, fieldState }) => (
                  <Input
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    type="date"
                    label="Дата начала проекта"
                    error={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="endDate"
                control={control}
                rules={{
                  validate: (value) => {
                    const startDate = getValues("startDate");
                    if (value && startDate && value < startDate) {
                      return "Дата окончания раньше даты начала";
                    }
                    return true;
                  },
                }}
                render={({ field, fieldState }) => (
                  <Input
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    type="date"
                    label="Дата окончания проекта"
                    error={fieldState.error?.message}
                  />
                )}
              />
            </div>
          </div>
        </form>
      </ModalBody>

      <ModalFooter>
        <Button
          type="submit"
          form="experience-form"
          size="lg"
          disabled={isPending}
        >
          {isPending ? "Сохранение..." : "Сохранить"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
