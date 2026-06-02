import { Icon } from "@iconify/react";
import { formatDate } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";

export interface UserData {
  firstName: string;
  avatarUrl: string;
  rating: number;
}

export interface QuestionData {
  user: UserData,
  title: string;
  description: string;
  skills: string[];   // question tags
  createdAt: Date;
  likes: number;
  comments: number;
  reposts: number;
}

export interface QuestionCardProps {
  question: QuestionData;
}

export function QuestionCard({
  question,
  }: QuestionCardProps) {
  return (
    <section className="flex flex-col justify-between h-fit px-3 md:px-8 py-8 md:py-9 border border-muted-foreground rounded-xl gap-y-5 md:gap-y-7">
      <div className="w-full flex flex-col gap-y-3">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={question.user.avatarUrl} alt="avatar" />
              <AvatarFallback></AvatarFallback>
            </Avatar>
            <span className="text-xl font-semibold">{question.user.firstName}</span>
            <div className="flex flex-row items-center gap-1">
              <Button variant="ghost" className="p-0" onClick={() => alert("В разработке")}>
                <Icon icon={"ph:star"} />
              </Button>
              <span className="text-lg align-middle">{question.user.rating}</span>
            </div>
          </div>
          <div className="text-sm">{formatDate(question.createdAt)}</div>
        </div>
        <h4 className="text-xl md:text-2xl font-bold leading-8">
          {question.title}
        </h4>
        <div className="flex flex-wrap gap-2">
          {question.skills.map((skill, index) => (
            <div className="inline-flex items-center border rounded-full px-3 py-1 text-lg text-foreground" key={index}>{skill}</div> // TODO: replace with Tags
          ))}
        </div>
      </div>
      <p className="w-full h-13 line-clamp-2">
        {question.description}
      </p>
      <div className="w-full h-13 flex justify-between items-center">
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
          <div className="flex gap-x-1 md:gap-x-3 items-center">
            <Button variant="ghost" className="p-0" onClick={() => alert("В разработке")}>
              <Icon icon={"ph:telegram-logo"} />
            </Button>
            <span>{question.reposts}</span>
          </div>
        </div>
        <Button variant="ghost" className="font-semibold" onClick={() => alert("В разработке")}>
          Подробнее
        </Button>
      </div>
    </section>
  )
};