import { useEffect, useState } from "react";
import {
  useInviteUser,
  useProjects,
} from "@/entities/project";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "@/shared/ui/modal/modal";
import { Button } from "@/shared/ui/button";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/shared/ui/radio-group";


type InviteUserModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | null;
};


export function InviteUserModal({
  open,
  onOpenChange,
  userId,
}: InviteUserModalProps) {
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const {
    data,
    isPending: isProjectsPending,
    isError: isProjectsError,
    refetch,
  } = useProjects(
    {
      myProject: true,
      status: "published",
      pageSize: 100,
    },
  );

  const {
    mutate: invite,
    isPending: isInviting,
  } = useInviteUser();


  const projects = data
    ? data.pages.flatMap((page) => page.items)
    : [];


  useEffect(() => {
    if (!open) {
      setSelectedProjectId("");
    }
  }, [open]);


  const handleInvite = () => {
    if (!userId || !selectedProjectId) {
      return;
    }

    invite(
      {
        projectId: selectedProjectId,
        userId,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };


  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      className="sm:max-w-[560px]"
    >
      <ModalHeader>
        <ModalTitle>
          Пригласить в проект
        </ModalTitle>
      </ModalHeader>


      <ModalBody>
        {isProjectsPending && (
          <p className="py-8 text-center text-muted-foreground">
            Загрузка проектов...
          </p>
        )}


        {isProjectsError && (
          <div className="flex flex-col items-center gap-4 py-8">
            <p className="text-center text-muted-foreground">
              Не удалось загрузить проекты.
            </p>

            <Button
              variant="default"
              onClick={() => refetch()}
            >
              Повторить
            </Button>
          </div>
        )}


        {!isProjectsPending &&
          !isProjectsError &&
          projects.length === 0 && (
            <p className="py-8 text-center text-muted-foreground">
              Нет опубликованных проектов.
            </p>
          )}


        {!isProjectsPending &&
          !isProjectsError &&
          projects.length > 0 && (
            <RadioGroup
              value={selectedProjectId}
              onValueChange={setSelectedProjectId}
              className="flex flex-col gap-3"
            >
              {projects.map((project) => (
                <label
                  key={project.projectId}
                  className="flex cursor-pointer items-center gap-4 rounded-xl border border-border p-4 transition-colors hover:border-primary"
                >
                  <RadioGroupItem
                    value={project.projectId}
                  />

                  <div className="min-w-0">
                    <p className="truncate font-semibold">
                      {project.title}
                    </p>

                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {project.shortDesc}
                    </p>
                  </div>
                </label>
              ))}
            </RadioGroup>
          )}
      </ModalBody>


      <ModalFooter>
        <Button
          variant="outline"
          type="button"
          onClick={() => onOpenChange(false)}
        >
          Отмена
        </Button>


        <Button
          type="button"
          disabled={
            !selectedProjectId ||
            isInviting ||
            isProjectsPending
          }
          onClick={handleInvite}
        >
          {isInviting
            ? "Отправка..."
            : "Пригласить"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}