import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent } from "@/shared/ui/dialog";
import { TextInput } from "@/shared/ui/text-input";

type setSkillsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void,
  onSubmit: (e) => void,
  skillsData: string[],
  qualitiesData: string[],
  aboutData: string
}

export function SetSkillsModal({
  open,
  onOpenChange,
  onSubmit,
  skillsData,
  qualitiesData,
  aboutData
}: setSkillsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="max-w-full md:max-w-[714px]">
        <form onSubmit={onSubmit} className="flex flex-col gap-6 p-8">
          <TextInput 
            label="Навыки и инструменты"
            placeholder="Начните вводить здесь"
            description="Выберите программы, которыми вы владеете"
            value={skillsData.join(", ")}
            />
          <TextInput 
            label="Личные качества"
            placeholder="Ваши преимущества"
            value={qualitiesData.join(", ")}
            />
          <TextInput 
            label="О себе"
            placeholder="Расскажите о себе"
            value={aboutData}
            />
          <Button type="submit" variant="default" className="mbs-6 md:max-w-33 self-center">Сохранить</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}