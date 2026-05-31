import { 
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter
} from "./modal";

import { Field, FieldGroup } from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Button } from "@/shared/ui/button"

type AuthModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalHeader>
        <ModalTitle>Создание проекта</ModalTitle>
      </ModalHeader>
      
      <ModalBody>
        <FieldGroup>
            <Field>
              <Label htmlFor="name-1">Название проекта</Label>
              <Input id="name-1" name="name" placeholder="Введите текст" />
            </Field>
            <Field>
              <Label htmlFor="username-1">Описание проекта</Label>
              <Input id="username-1" name="username" placeholder="Начните писать..." />
            </Field>
            <Field>
              <Label htmlFor="name-1">Название проекта</Label>
              <Input id="name-1" name="name" placeholder="Введите текст" />
            </Field>
            <Field>
              <Label htmlFor="username-1">Описание проекта</Label>
              <Input id="username-1" name="username" placeholder="Начните писать..." />
            </Field>
            <Field>
              <Label htmlFor="name-1">Название проекта</Label>
              <Input id="name-1" name="name" placeholder="Введите текст" />
            </Field>
            <Field>
              <Label htmlFor="username-1">Описание проекта</Label>
              <Input id="username-1" name="username" placeholder="Начните писать..." />
            </Field>
            <Field>
              <Label htmlFor="name-1">Название проекта</Label>
              <Input id="name-1" name="name" placeholder="Введите текст" />
            </Field>
            <Field>
              <Label htmlFor="username-1">Описание проекта</Label>
              <Input id="username-1" name="username" placeholder="Начните писать..." />
            </Field>
            <Field>
              <Label htmlFor="name-1">Название проекта</Label>
              <Input id="name-1" name="name" placeholder="Введите текст" />
            </Field>
            <Field>
              <Label htmlFor="username-1">Описание проекта</Label>
              <Input id="username-1" name="username" placeholder="Начните писать..." />
            </Field>
          </FieldGroup>
      </ModalBody>
      
      <ModalFooter>
        <Button>Отмена</Button>
        <Button type="submit">Создать</Button>
      </ModalFooter>
    </Modal>
  );
}
