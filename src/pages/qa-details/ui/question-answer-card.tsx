import { type QuestionAnswerDto } from "@/entities/question";
import { Card, CardContent } from "@/shared/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Icon } from "@iconify/react";
import AvatarPlaceholder from "@/shared/assets/images/avatar-placeholder.svg";
import { formatRelativeDate } from "@/shared/lib/pluralize";

export function QuestionAnswerCard({ answer }: { answer: QuestionAnswerDto }) {
  const images = answer.images ?? [];
  const avatarSrc = answer.author_avatar || undefined;

  return (
    <Card className="rounded-[24px] border border-muted-foreground">
      <CardContent className="!p-6">
        <div className="flex items-start gap-3">
          <Avatar className="size-12">
            <AvatarImage src={avatarSrc} alt={answer.author_name} />
            <AvatarFallback className="bg-transparent p-0">
              <img
                src={AvatarPlaceholder}
                alt=""
                aria-hidden="true"
                className="h-full w-full object-cover"
              />
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-lg font-semibold text-foreground">
                    {answer.author_name}
                  </span>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Icon icon="ph:thumbs-up" className="size-5" />
                    <span>{answer.author_rating}</span>
                  </div>
                </div>
                {answer.parent_answer_id && (
                  <span className="mt-1 inline-flex rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                    Ответ на комментарий
                  </span>
                )}
              </div>

              <span className="whitespace-nowrap text-sm text-muted-foreground">
                {formatRelativeDate(answer.created_at)}
              </span>
            </div>

            <p className="mt-4 whitespace-pre-line text-base leading-6 text-foreground">
              {answer.content}
            </p>

            {images.length > 0 && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {images.map((src) => (
                  <img
                    key={src}
                    src={src}
                    alt={answer.author_name}
                    className="max-h-56 w-full rounded-2xl object-cover"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
