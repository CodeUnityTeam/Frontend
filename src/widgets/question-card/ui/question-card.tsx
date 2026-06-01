import { useState } from "react";
import { Icon } from "@iconify/react";
import { formatDate } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button"

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
            <img src={question.user.avatarUrl} alt="avatar" className="w-10 h-10 rounded-25"/>
            <span className="text-xl font-semibold">{question.user.firstName}</span>
            <div className="flex flex-row items-center gap-1">
              <Icon icon={"ph:star"} height="24" />
              <span>{question.user.rating}</span>
            </div>
          </div>
          <div className="text-sm">{formatDate(question.createdAt)}</div>
        </div>
        <h4 className="text-xl md:text-[26px] font-bold leading-8">
          {question.title}
        </h4>
        <div className="h-9">
          {question.skills.map((skill, index) => (
            <div key={index}>{skill}</div>
          ))}
        </div>
      </div>
      <p className="w-full h-13 line-clamp-2">
        {question.description}
      </p>
      <div className="w-full h-13 flex justify-between items-center">
        <div className="flex gap-x-3">
          <div className="flex gap-x-1 hover:cursor-pointer">
            <Icon icon={"ph:heart-straight"} height="24" />
            <span>{question.likes}</span>
          </div>
          <div className="flex gap-x-1 hover:cursor-pointer">
            <Icon icon={"ph:chat-teardrop-dots"} height="24" />
            <span>{question.comments}</span>
          </div>
          <div className="flex gap-x-1 hover:cursor-pointer">
            <Icon icon={"ph:telegram-logo"} height="24" />
            <span>{question.reposts}</span>
          </div>
        </div>
        <Button variant="ghost" onClick={() => alert("В разработке")}>
          Подробнее
        </Button>
      </div>
    </section>
  )
};