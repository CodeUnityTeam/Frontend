import { useState, useCallback } from "react";
import { useParams, Navigate, useNavigate } from "react-router";
import { toast } from "sonner";

import { isAuth } from "@/shared/config/mock-config";
import { ROUTES } from "@/shared/model/routes";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { PageContainer } from "@/shared/ui/page-container";
import { Tag } from "@/shared/ui/tag";
import { Separator } from "@/shared/ui/field/separator";
import { Icon } from "@iconify/react";
import { getProjectById, type Project } from "@/entities/project";

function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(() => {
    if (!id) return null;
    return getProjectById(id) || null;
  });
  const [isApplying, setIsApplying] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  if (!isAuth) {
    return <Navigate to={ROUTES.REGISTER} replace />;
  }

  if (!project) {
    return (
      <PageContainer className="py-8 md:py-12">
        <div className="mx-auto max-w-4xl py-20 text-center">
          <Icon
            icon="ph:warning"
            className="mx-auto h-16 w-16 text-muted-foreground"
          />
          <h2 className="mt-4 text-2xl font-semibold">Проект не найден</h2>
          <p className="mt-2 text-muted-foreground">
            Такого проекта не существует или он был удален
          </p>
          <Button className="mt-6" onClick={() => navigate("/projects")}>
            Вернуться к проектам
          </Button>
        </div>
      </PageContainer>
    );
  }

  const handleApply = useCallback(async () => {
    setIsApplying(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setProject((prev) => (prev ? { ...prev, isApplied: true } : null));
      toast.success("Вы успешно откликнулись на проект!");
    } catch (error) {
      toast.error("Не удалось откликнуться. Попробуйте позже.");
    } finally {
      setIsApplying(false);
    }
  }, []);

  const handleLike = useCallback(async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setProject((prev) =>
        prev
          ? {
              ...prev,
              isLiked: !prev.isLiked,
              likesCount: prev.isLiked
                ? prev.likesCount - 1
                : prev.likesCount + 1,
            }
          : null,
      );
    } catch (error) {
      console.error("Ошибка при лайке:", error);
    } finally {
      setIsLiking(false);
    }
  }, [isLiking]);

  const handleCopyUrl = useCallback(async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Ссылка скопирована!");
    } catch (error) {
      toast.error("Не удалось скопировать ссылку");
    }
  }, []);

  const allTags = [
    ...project.skills,
    ...project.specializations,
    ...project.workFormats,
  ];
  const canApply = project.status === "published" && !project.isApplied;

  return (
    <PageContainer className="py-6 md:py-8 lg:py-12">
      <div className="mx-auto max-w-3xl lg:max-w-4xl">
        {/* Кнопка Назад */}
        <button
          onClick={() => navigate("/projects")}
          className="mb-6 flex items-center gap-1 text-base text-muted-foreground transition-colors hover:text-foreground"
        >
          <Icon icon="ph:arrow-left" className="h-5 w-5" />
          <span>Назад</span>
        </button>

        {/* Основная карточка */}
        <Card className="overflow-hidden border-border shadow-sm">
          <CardContent className="p-5 sm:p-6 md:p-8">
            {/* Шапка: информация об авторе */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  {project.author.avatar ? (
                    <AvatarImage
                      src={project.author.avatar}
                      alt={project.author.username}
                    />
                  ) : null}
                  <AvatarFallback className="bg-muted text-foreground">
                    {project.author.firstName?.[0] ||
                      project.author.username[1]?.toUpperCase() ||
                      "А"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">
                    {project.author.firstName || project.author.username}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    был(а) - 5 марта
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1 text-sm sm:text-right">
                <p className="text-muted-foreground">
                  {project.author.username}
                </p>
                <p className="text-muted-foreground">{project.author.email}</p>
                <p className="text-muted-foreground">Контактный телефон</p>
              </div>
            </div>

            {/* Кнопка Откликнуться */}
            <div className="mb-8">
              {canApply ? (
                <Button
                  onClick={handleApply}
                  disabled={isApplying}
                  className="w-full px-8 py-2.5 text-base font-semibold sm:w-auto"
                >
                  {isApplying ? "Отправка..." : "Откликнуться"}
                </Button>
              ) : project.isApplied ? (
                <Button
                  variant="outline"
                  disabled
                  className="w-full px-8 py-2.5 sm:w-auto"
                >
                  <Icon
                    icon="ph:check-circle"
                    className="mr-2 h-5 w-5 text-green-500"
                  />
                  Отклик отправлен
                </Button>
              ) : null}
            </div>

            <Separator className="my-6" />

            {/* Дата начала */}
            <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
              <Icon icon="ph:calendar" className="h-5 w-5" />
              <span>
                Дата начала:{" "}
                <span className="font-medium text-foreground">
                  {new Date(project.startDate).toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </span>
            </div>

            {/* Заголовок проекта */}
            <h1 className="mb-4 text-2xl font-bold md:text-3xl">
              {project.title}
            </h1>

            {/* Теги технологий */}
            <div className="mb-6 flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Tag key={tag} variant="muted" className="text-sm">
                  {tag}
                </Tag>
              ))}
            </div>

            {/* Описание */}
            <p className="mb-8 text-base leading-relaxed text-foreground">
              {project.description}
            </p>

            <Separator className="my-6" />

            {/* Приглашаем в команду */}
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold">
                Приглашаем в команду:
              </h2>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                  <span>Разработчиков (backend, frontend, fullstack)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                  <span>DevOps-инженеров, системных администраторов</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                  <span>UX/UI дизайнеров</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                  <span>Аналитиков данных и Data Scientists</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                  <span>Тестировщиков и QA-специалистов</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                  <span>Менеджеров IT-проектов</span>
                </li>
              </ul>
            </div>

            <Separator className="my-6" />

            {/* Участники */}
            <div className="mb-6">
              <div className="mb-4 flex items-center gap-2">
                <h2 className="text-xl font-semibold">Участники</h2>
                <span className="text-muted-foreground">
                  ({project.participants.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-4">
                {project.participants.map((participant) => (
                  <Avatar key={participant.id} className="h-12 w-12">
                    <AvatarImage
                      src={participant.user.avatar}
                      alt={participant.user.username}
                    />
                    <AvatarFallback className="bg-muted text-foreground">
                      {participant.user.firstName?.[0] ||
                        participant.user.username[1]?.toUpperCase() ||
                        "У"}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {/* Добавляем недостающие аватарки до 4, если нужно */}
                {project.participants.length < 4 &&
                  Array.from({ length: 4 - project.participants.length }).map(
                    (_, i) => (
                      <Avatar key={`empty-${i}`} className="h-12 w-12">
                        <AvatarImage src="" alt="" />
                        <AvatarFallback className="bg-muted text-muted-foreground">
                          ?
                        </AvatarFallback>
                      </Avatar>
                    ),
                  )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Футер */}
        <footer className="mt-12 border-t border-border pt-6">
          <div className="flex flex-wrap justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2026 Код Юнити</p>
            <nav className="flex flex-wrap gap-4 md:gap-6">
              <a
                href="/projects"
                className="transition-colors hover:text-foreground"
              >
                Проекты
              </a>
              <a href="/qa" className="transition-colors hover:text-foreground">
                Q&A
              </a>
              <a
                href="/about"
                className="transition-colors hover:text-foreground"
              >
                О нас
              </a>
              <a
                href="/help"
                className="transition-colors hover:text-foreground"
              >
                Помощь
              </a>
              <a
                href="/documents"
                className="transition-colors hover:text-foreground"
              >
                Документы
              </a>
            </nav>
          </div>
        </footer>

        {/* Кнопки копирования и лайка (плавающие) */}
        <div className="fixed right-6 bottom-6 flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopyUrl}
            className="h-10 w-10 rounded-full bg-background shadow-lg"
            aria-label="Копировать ссылку"
          >
            <Icon icon="ph:copy" className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={handleLike}
            disabled={isLiking}
            className="h-10 w-10 rounded-full bg-background shadow-lg"
            aria-label={project.isLiked ? "Убрать лайк" : "Поставить лайк"}
          >
            <Icon
              icon={project.isLiked ? "ph:heart-fill" : "ph:heart"}
              className={`h-5 w-5 ${project.isLiked ? "text-red-500" : ""}`}
            />
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}

export const Component = ProjectDetails;
