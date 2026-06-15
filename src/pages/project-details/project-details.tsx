import { useNavigate } from "react-router";
import { Icon } from "@iconify/react";

import { useProject } from "./hooks";

// import { isAuth } from "@/shared/config/mock-config";
// import { ROUTES } from "@/shared/model/routes";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar/avatar";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card/card";
import { PageContainer } from "@/shared/ui/page-container/page-container";
import { Tag } from "@/shared/ui/tag/tag";

function ProjectDetails() {
  const navigate = useNavigate();

  const { data: project } = useProject();

  // if (!isAuth) {
  //   return <Navigate to={ROUTES.REGISTER} replace />;
  // }

  // Пока используем мок через fetchProject()
  if (!project) {
    return null;
  }

  return (
    <PageContainer className="py-8">
      <Button
        variant="ghost"
        className="mb-6 gap-2 px-0"
        onClick={() => navigate(-1)}
      >
        <Icon icon="ph:arrow-left" className="h-5 w-5" />
        Назад
      </Button>

      <div className="grid gap-8 xl:grid-cols-[260px_1fr]">
        {/* Карточка автора */}
        <Card className="h-fit rounded-3xl">
          <CardContent className="p-4">
            <div className="mb-5 flex items-start gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={project.author.avatar} />
                <AvatarFallback>
                  {project.author.firstName[0]}
                </AvatarFallback>
              </Avatar>

              <div>
                <div className="text-xl font-medium">
                  {project.author.firstName}
                  {project.author.lastName
                    ? ` ${project.author.lastName}`
                    : ""}
                </div>

                <div className="text-sm text-muted-foreground">
                  был(а) • 5 марта
                </div>
              </div>
            </div>

            <div className="mb-5 space-y-4">
              <div className="flex items-center gap-3">
                <Icon
                  icon="ph:paper-plane-tilt"
                  className="text-lg text-muted-foreground"
                />

                <span className="text-primary">
                  @{project.author.username}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Icon
                  icon="ph:envelope"
                  className="text-lg text-muted-foreground"
                />

                <span className="break-all text-primary">
                  {project.author.email}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Icon
                  icon="ph:phone"
                  className="text-lg text-muted-foreground"
                />

                <span>
                  {project.author.phone ?? "Контактный телефон"}
                </span>
              </div>
            </div>

            <Button className="w-full">
              {project.isApplied ? "Отклик отправлен" : "Откликнуться"}
            </Button>
          </CardContent>
        </Card>

        {/* Карточка проекта */}
        <Card className="rounded-3xl">
          <CardContent className="flex min-h-[580px] flex-col p-8">
            {/* Верхняя панель */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon icon="ph:calendar" className="text-lg" />

                <span>
                  Дата начала: {project.startDate}
                </span>
              </div>

              <button
                type="button"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <Icon
                  icon={
                    project.isLiked
                      ? "ph:heart-fill"
                      : "ph:heart"
                  }
                  className="text-2xl"
                />
              </button>
            </div>

            {/* Заголовок */}
            <h1 className="mb-4 text-4xl font-semibold">
              {project.title}
            </h1>

            {/* Навыки */}
            <div className="mb-8 flex flex-wrap gap-2">
              {project.skills.map((skill) => (
                <Tag key={skill}>{skill}</Tag>
              ))}
            </div>

            {/* Описание */}
            <p className="mb-12 max-w-4xl text-lg leading-relaxed">
              {project.description}
            </p>

            {/* Специализации */}
            <div className="mb-16">
              <div className="mb-4 text-2xl font-medium">
                Приглашаем в команду:
              </div>

              <div className="grid gap-y-4 md:grid-cols-2 md:gap-x-8">
                {project.specializations.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3"
                  >
                    <span>•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Нижняя часть */}
            <div className="mt-auto flex items-end justify-between">
              <div>
                <div className="mb-3 text-lg">
                  Участники ({project.participants.length})
                </div>

                <div className="flex -space-x-2">
                  {project.participants.map((participant) => (
                    <Avatar
                      key={participant.id}
                      className="h-10 w-10 border-2 border-background"
                    >
                      <AvatarImage
                        src={participant.user.avatar}
                      />

                      <AvatarFallback>
                        {participant.user.firstName[0]}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Icon
                    icon="ph:thumbs-up"
                    className="text-xl"
                  />

                  <span>{project.likesCount}</span>
                </div>

                <button
                  type="button"
                  className="transition-colors hover:text-foreground"
                >
                  <Icon
                    icon="ph:copy-simple"
                    className="text-xl"
                  />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

export const Component = ProjectDetails;