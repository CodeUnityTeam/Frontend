import { Icon } from "@iconify/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import type { Review } from "@/entities/review/model/types";

type ReviewCardProps = Omit<Review, "id">;

export function ReviewCard({ author, text }: ReviewCardProps) {
  return (
    <Card className="h-full rounded-2xl bg-muted">
      <CardHeader className="flex-row items-center gap-4 space-y-0 p-4 pt-5 md:p-6">
        <Avatar className="size-14 shrink-0 md:size-16">
          <AvatarImage src={author.avatarUrl} alt={`${author.name} avatar`} />
          <AvatarFallback className="">
            <Icon icon="ph:user" className="size-6" />
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-base leading-[1.3] md:text-[26px] md:font-bold">
            {author.name}
          </CardTitle>
          <CardDescription className="text-[13px] leading-[1.3] text-foreground md:text-lg md:leading-normal">
            {author.profession}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm leading-none md:text-lg md:leading-normal">
          {text}
        </p>
      </CardContent>
    </Card>
  );
}
