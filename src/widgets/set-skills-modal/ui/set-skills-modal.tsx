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
import type { SkillsFormData } from "@/widgets/account/model/types";

type setSkillsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  formData: SkillsFormData;
  onSkillsChange: (newSkills: string[]) => void;
  onQualitiesChange: (newQualities: string[]) => void;
  onAboutChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function SetSkillsModal({
  open,
  onOpenChange,
  onSubmit,
  onSkillsChange,
  onQualitiesChange,
  onAboutChange,
  formData,
}: setSkillsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay />
      <DialogContent className="mx-auto p-4 pbs-12 md:max-w-[714px] md:p-8 md:pbs-16">
        <DialogTitle className="sr-only">Форма навыков</DialogTitle>
        <DialogDescription className="sr-only">
          Форма заполнения навыков, личных качеств и информации о себе
        </DialogDescription>
        <form onSubmit={onSubmit} className="flex flex-col gap-4 md:gap-6">
          <TagInput
            label="Навыки и инструменты"
            placeholder="Начните вводить здесь"
            description="Выберите программы, которыми вы владеете"
            value={formData.skills}
            onChange={onSkillsChange}
          />
          <TagInput
            label="Личные качества"
            placeholder="Ваши преимущества"
            value={formData.qualities}
            onChange={onQualitiesChange}
          />
          <TextInput
            label="О себе"
            placeholder="Расскажите о себе"
            value={formData.about}
            onChange={onAboutChange}
          />
          <Button
            type="submit"
            variant="default"
            className="w-full self-center md:mbs-6 md:max-w-33"
          >
            Сохранить
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
