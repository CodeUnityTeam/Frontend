import { useNavigate } from "react-router";
import { Icon } from "@iconify/react";
import { useProject } from "./hooks";
import { useLikeProject } from "@/entities/project";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar/avatar";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card/card";
import { PageContainer } from "@/shared/ui/page-container/page-container";
import { Tag } from "@/shared/ui/tag";

function ProjectDetails() {
  const navigate = useNavigate();

  const { data: project } = useProject()
  
  const { mutate: toggleLike } = useLikeProject();

  if (!project || !Object.keys(project).length) return null;

  const handleLike = () => {
    toggleLike({
      projectId: project.project_id,
      liked: !project.is_liked_by_me,
    });
  };

  return (
    <PageContainer className="py-4">
      <Button
        variant="ghost"
        className="mt-0.5 mb-1 gap-2 px-0"
        onClick={() => navigate(-1)}
      >
        <Icon icon="ph:arrow-left" className="h-5 w-5" />
        Назад
      </Button>

      <div className="grid gap-4 xl:grid-cols-[273px_1fr] xl:gap-13">
        <Card className="h-fit w-full rounded-2xl">
          <CardContent className="px-2 pt-5 pb-7">
            <div className="px-2">
              <div className="flex items-start gap-3">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={project?.author?.avatar_url} />
                </Avatar>

                <div>
                  <div className="text-lg font-semibold">
                    {project.author.full_name}
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {project.author.last_activity_at
                      ? `был(а) • ${new Date(
                          project.author.last_activity_at,
                        ).toLocaleDateString("ru-RU", {
                          day: "numeric",
                          month: "long",
                        })}`
                      : "недавно"}
                  </div>
                </div>
              </div>

              <div className="mt-3 space-y-3">
                <div className="flex items-center gap-3">
                  <Icon
                    icon="ph:paper-plane-tilt"
                    className="size-6 text-muted-foreground"
                  />

                  {/* <span className="text-primary">
                    @{project.author.telegram} // нет такого поля в бэкенде
                  </span> */}
                </div>

                <div className="flex items-center gap-3">
                  <Icon
                    icon="ph:envelope"
                    className="size-6 text-muted-foreground"
                  />

                  <span className="break-all text-primary">
                    {project.author.email}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Icon
                    icon="ph:phone"
                    className="size-6 text-muted-foreground"
                  />

                  <span>{project.author.phone_number ?? "Не указан"}</span>
                </div>
              </div>
            </div>

            {/* TO DO: Добавить проверку на то, что пользователь является участником проекта (#11_июля) */}
            <Button variant="outline" className="mt-6 h-10 w-full">
             Откликнуться
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-[24px]">
          <CardContent className="flex flex-col p-8 pt-10 pb-8 xl:max-h-[655px]">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon icon="ph:calendar" className="size-7 text-lg" />

                <span>Дата начала: {project.start_date}</span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                type="button"
                aria-label={
                  project.is_liked_by_me
                    ? "Убрать из избранного"
                    : "Добавить в избранное"
                }
                aria-pressed={project.is_liked_by_me}
                onClick={handleLike}
              >
                <Icon
                  icon={project.is_liked_by_me ? "ph:heart-fill" : "ph:heart"}
                  className={project.is_liked_by_me ? "text-primary" : undefined}
                />
              </Button>
            </div>

            <h1 className="mb-3 text-[26px] leading-[32px] font-bold tracking-normal">
              {project.title}
            </h1>

            <div className="mb-6 flex flex-wrap gap-2">
              {project.skills.map((skill) => (
                <Tag
                  key={skill.skill_id}
                  variant="outline"
                  className="text-[18px] leading-[150%] font-normal tracking-normal"
                >
                  {skill.name}
                </Tag>
              ))}
            </div>

            <p className="mb-10 max-w-4xl text-[18px] leading-[130%] font-semibold">
              {project.full_desc || project.short_desc}
            </p>

            <div className="mb-10 flex flex-col gap-4 xl:flex-row xl:gap-6">
              <div className="text-[18px] font-semibold xl:w-[210px] xl:shrink-0">
                Приглашаем в команду:
              </div>

              <ul className="space-y-3">
                {project.specializations.map((item) => (
                  <li
                    key={item.spec_id}
                    className="flex gap-3 text-[18px] leading-[150%]"
                  >
                    <span>•</span>
                    <span>{item.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto flex items-end justify-between">
              <div>
                <div className="mb-2 text-lg">
                  Участники ({project.participants.length})
                </div>

                <div className="flex -space-x-2">
                  {project?.participants?.map((participant) => (
                    <Avatar
                      key={participant?.user_id}
                      className="h-10 w-10 border-2 border-background"
                    >
                      <AvatarImage src={participant?.avatar_url} />

                      <AvatarFallback>
                        {participant?.full_name}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Icon
                    icon="ph:thumbs-up"
                    className="size-6 text-muted-foreground"
                  />

                  <span>{project.likes_count}</span>
                </div>

                <Button variant="ghost" size="icon">
                  <Icon
                    icon="ph:copy-simple"
                    className="size-6 text-muted-foreground"
                  />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

export const Component = ProjectDetails;
