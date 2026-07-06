import { Icon } from "@iconify/react";

import { useLikeAnswer } from "@/entities/question/api/use-like-answer";
import { useAnswerLikeState } from "@/shared/store/answer-likes-store";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

type AnswerLikeButtonProps = {
  answerId: string;
  likesCount: number;
  className?: string;
};

export function AnswerLikeButton({
  answerId,
  likesCount,
  className,
}: AnswerLikeButtonProps) {
  const isLikedByMe = useAnswerLikeState(answerId);
  const { mutate: toggleLike, isPending } = useLikeAnswer();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      aria-label={isLikedByMe ? "Убрать лайк ответа" : "Поставить лайк ответу"}
      aria-pressed={isLikedByMe}
      onClick={() => toggleLike({ answerId, liked: !isLikedByMe })}
      disabled={isPending}
      className={cn(
        "gap-2 px-3 font-medium text-muted-foreground hover:text-primary",
        isLikedByMe && "text-primary",
        className,
      )}
    >
      <Icon
        icon={isLikedByMe ? "ph:thumbs-up-fill" : "ph:thumbs-up"}
        className={cn("size-5", isLikedByMe && "text-primary")}
      />
      <span>{likesCount}</span>
    </Button>
  );
}
