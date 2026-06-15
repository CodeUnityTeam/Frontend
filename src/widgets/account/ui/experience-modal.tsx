import { Icon } from "@iconify/react";
import { useState } from "react";

import { Button } from "@/shared/ui/button";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@/shared/ui/modal/modal";

import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";

interface ExperienceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatDateValue = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 8);

  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);

  const safeDay =
    day.length === 2
      ? String(Math.min(Math.max(Number(day), 1), 31)).padStart(2, "0")
      : day;

  const safeMonth =
    month.length === 2
      ? String(Math.min(Math.max(Number(month), 1), 12)).padStart(2, "0")
      : month;

  return [safeDay, safeMonth, year].filter(Boolean).join(".");
};

export const ExperienceModal = ({
  open,
  onOpenChange,
}: ExperienceModalProps) => {
  const [projectStart, setProjectStart] = useState("");
  const [projectEnd, setProjectEnd] = useState("");

  const handleDateChange = (value: string, setter: (value: string) => void) => {
    setter(formatDateValue(value));
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      className="rounded-[20px] sm:max-w-178"
    >
      <ModalHeader />

      <ModalBody>
        <div className="flex flex-col gap-4 sm:gap-7">
          <Input label="Название компании" placeholder="Например Яндекс" />

          <Input label="Должность" placeholder="Например Дизайнер" />

          <Textarea
            label="Обязанности"
            placeholder="Распишите подробно свои обязанности"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            <Input
              label="Дата начала проекта"
              placeholder="дд.мм.гггг"
              value={projectStart}
              onChange={(e) =>
                handleDateChange(e.target.value, setProjectStart)
              }
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={10}
              rightElement={
                <span className="cursor-pointer">
                  <Icon icon="solar:calendar-linear" />
                </span>
              }
            />

            <Input
              label="Дата окончания проекта"
              placeholder="дд.мм.гггг"
              value={projectEnd}
              onChange={(e) => handleDateChange(e.target.value, setProjectEnd)}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={10}
              rightElement={
                <span className="cursor-pointer">
                  <Icon icon="solar:calendar-linear" />
                </span>
              }
            />
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button
          size="lg"
          onClick={() => {
            onOpenChange(false);
            alert("В разработке");
          }}
        >
          Сохранить
        </Button>
      </ModalFooter>
    </Modal>
  );
};
