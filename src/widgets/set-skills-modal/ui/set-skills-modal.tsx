import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogOverlay, DialogTitle } from "@/shared/ui/dialog";
import { TextInput } from "@/shared/ui/text-input";
import type { SkillsFormData } from "@/widgets/account/model/types";

type setSkillsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void,
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
  onChange: (field: keyof SkillsFormData) => (e: React.ChangeEvent<HTMLInputElement>) => void,
  formData: SkillsFormData
}

export function SetSkillsModal({
  open,
  onOpenChange,
  onSubmit,
  onChange,
  formData
}: setSkillsModalProps) {
  console.log(formData);
  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogOverlay />
      <DialogContent className="max-w-full md:max-w-[714px]">
        <VisuallyHidden>
          <DialogTitle>Форма навыков</DialogTitle>
          <DialogDescription>Форма заполнения навыков, личных качеств и информации о себе</DialogDescription>
        </VisuallyHidden>
        <form onSubmit={onSubmit} className="flex flex-col gap-6 p-8">
          <TextInput 
            label="Навыки и инструменты"
            placeholder="Начните вводить здесь"
            description="Выберите программы, которыми вы владеете"
            value={formData.skills.join(", ")}
            onChange={onChange("skills")}
            />
          <TextInput 
            label="Личные качества"
            placeholder="Ваши преимущества"
            value={formData.qualities.join(", ")}
            onChange={onChange("qualities")}
            />
          <TextInput 
            label="О себе"
            placeholder="Расскажите о себе"
            value={formData.about}
            onChange={onChange("about")}
            />
          <Button type="submit" variant="default" className="mbs-6 md:max-w-33 self-center">Сохранить</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}