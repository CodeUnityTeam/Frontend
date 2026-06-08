import { Icon } from "@iconify/react";
import { formatRelativeDate } from "@/shared/lib/pluralize";
import { Button } from "@/shared/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/shared/ui/card";
import { Tag } from "@/shared/ui/tag";
import type { QuestionCardProps } from "../model/types";

export function QuestionCard({
  question,
  }: QuestionCardProps) {
  return (
    <Card className="h-fit border-muted-foreground">
      <CardHeader className="flex flex-row justify-between items-start gap-4 p-6 pb-3">
        <div className="flex flex-col gap-y-3 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={question.user.avatarUrl} alt="avatar" />
                <AvatarFallback>
                  <Icon icon="ph:user" className="size-6" />
                </AvatarFallback>
              </Avatar>
              <span className="text-xl font-semibold">{question.user.firstName}</span>
              <div className="flex flex-row items-center gap-1">
                <Button variant="ghost" className="p-0" onClick={() => alert("В разработке")}>
                  <Icon icon={"ph:thumbs-up"} />
                </Button>
                <span className="text-lg align-middle">{question.user.rating}</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground whitespace-nowrap">
              {formatRelativeDate(question.createdAt)}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold leading-8">
            {question.title}
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            {question.skills.map((skill, index) => (
              <Tag variant="outline" key={index}>
                {skill}
              </Tag>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 pt-0">
        <CardDescription className="text-lg text-foreground line-clamp-2">
          {question.description}
        </CardDescription>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center p-6 pt-0">
        <div className="flex gap-x-3 md:gap-x-5">
          <div className="flex gap-x-1 md:gap-x-3 items-center">
            <Button variant="ghost" className="p-0" onClick={() => alert("В разработке")}>
              <Icon icon={"ph:heart-straight"} />
            </Button>
            <span>{question.likes}</span>
          </div>
          <div className="flex gap-x-1 md:gap-x-3 items-center">
            <Button variant="ghost" className="p-0" onClick={() => alert("В разработке")}>
              <Icon icon={"ph:chat-teardrop-dots"} />
            </Button>
            <span>{question.comments}</span>
          </div>
        </div>
        <Button variant="ghost" className="font-semibold" onClick={() => alert("В разработке")}>
          Подробнее
        </Button>
      </CardFooter>
    </Card>
  )
};