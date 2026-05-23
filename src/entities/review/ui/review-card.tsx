import React from "react";
import { Icon } from "@iconify/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

interface ReviewCardProps {
  author: {
    name: string;
    profession: string;
    avatarUrl: string;
  };
  text: string;
}

function ReviewCard({ author, text }: ReviewCardProps) {
  return (
    <Card className="rounded-2xl bg-muted">
      <CardHeader className="flex-row items-center gap-4 space-y-0 p-4 pt-5 md:p-6">
        <Avatar className="size-14 shrink-0 md:size-16">
          <AvatarImage src={author.avatarUrl} alt={`${author.name} avatar`} />
          <AvatarFallback className="">
            <Icon icon="ph:user" className="size-6" />
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-base leading-8 md:text-[26px] md:font-bold">
            {author.name}
          </CardTitle>
          <CardDescription className="text-[13px] leading-snug text-foreground md:text-lg md:leading-normal">
            {author.profession}{" "}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm md:text-lg">{text}</p>
      </CardContent>
    </Card>
  );
}

export default ReviewCard;
