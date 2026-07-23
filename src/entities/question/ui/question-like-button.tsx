import { Icon } from "@iconify/react";

import { useLikeQuestion } from "@/entities/question/api/use-like-question";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

type QuestionLikeButtonProps = {
  questionId: string;
  likesCount: number;
  isLikedByMe: boolean;
  className?: string;
};

export function QuestionLikeButton({
  questionId,
  likesCount,
  isLikedByMe,
  className,
}: QuestionLikeButtonProps) {
  const { mutate: toggleLike, isPending } = useLikeQuestion();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      aria-label={isLikedByMe ? "Убрать лайк" : "Поставить лайк"}
      aria-pressed={isLikedByMe}
      onClick={() => toggleLike({ questionId, liked: !isLikedByMe })}
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
