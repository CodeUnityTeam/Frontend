import { Button } from "@/shared/ui/button";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "@/shared/ui/modal/modal";

import { Field, FieldGroup, FieldLabel } from "@/shared/ui/field";

import {
  InputGroup,
  InputGroupInput,
  InputGroupTextarea,
} from "@/shared/ui/input/input-group";

import { Icon } from "@iconify/react";

type FeedbackModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function FeedbackModal({ open, onOpenChange }: FeedbackModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      className="w-[361px] rounded-xl px-4 py-8 sm:w-[696px] sm:px-12 sm:pt-[71px] sm:pb-12"
    >
      <ModalHeader className="pb-[38.5px]">
        <ModalTitle className="text-xl sm:text-[26px] sm:leading-[130%] sm:font-bold">
          Форма обратной связи
        </ModalTitle>
      </ModalHeader>
      <form>
        <ModalBody className="sm:pt-8">
          <FieldGroup className="gap-4 sm:gap-8">
            <Field className="gap-2">
              <FieldLabel className="text-sm leading-[150%] sm:text-xl sm:leading-[130%]">
                Тема обращения
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  className="p-4 text-sm leading-[130%] placeholder:text-sm"
                  placeholder="Введите текст"
                />
              </InputGroup>
            </Field>
            <Field className="gap-2">
              <FieldLabel className="text-sm leading-[150%] sm:text-xl sm:leading-[130%]">
                Текст
              </FieldLabel>
              <InputGroup>
                <InputGroupTextarea
                  className="h-[111px] p-4 text-sm leading-[130%] placeholder:text-sm"
                  placeholder="Расскажите о своей проблеме или предложении"
                />
              </InputGroup>
            </Field>
            <Button
              variant="ghost"
              className="h-6 self-start p-0 pl-2 text-sm [&_svg]:size-5"
            >
              <Icon icon="ph:paperclip" />
              Прикрепить данные
            </Button>
          </FieldGroup>
        </ModalBody>
        <ModalFooter className="sm:justify-end">
          <Button
            type="submit"
            variant="default"
            size="lg"
            className="sm:-end sm:w-[291px]"
          >
            Отправить
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
