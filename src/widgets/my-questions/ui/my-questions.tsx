import type { Question } from "@/entities/question/model/types";
import { Icon } from "@iconify/react";
import type { QuestionTag } from "../model/types";
import { Link } from "react-router";

type TQuestionCard = Omit<Question, "tags"> & {
  author: {
    name: string;
    avatar: string;
  };
  likes: number;
  createdAt: string;
  details: string;
  tags: QuestionTag[];
};

type TMyQuestionsCard = {
  question: TQuestionCard;
};

export function MyQuestionsCard({ question }: TMyQuestionsCard) {
  return (
    <article className="mt-5 w-full max-w-[955px] rounded-[var(--radius-lg)] border border-1 border-[var(--color-gray)] bg-[var(--color-white)] px-8 py-9">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={question.author.avatar}
            alt={question.author.name}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="flex items-center gap-3">
            <span className="text-[20px] font-semibold text-[var(--color-black)]">
              {question.author.name}
            </span>
            <div className="flex items-center gap-1 text-[var(--color-black)]">
              <Icon icon="ph:thumbs-up" className="h-5 w-5" />
              <span className="text-[18px]">{question.likes}</span>
            </div>
          </div>
        </div>

        <span className="pt-3 pb-3 text-[14px] text-[var(--color-black)]">
          {question.createdAt}
        </span>
      </div>

      <h2 className="mt-3 text-[26px] font-bold text-[var(--color-black)]">
        {question.title}
      </h2>

      <div className="mt-3 flex flex-wrap gap-2">
        {question.tags.map((tag) => (
          <span
            key={tag.id}
            className="rounded-[var(--radius-lg)] border border-1 border-[var(--color-gray)] px-3 py-1 text-[18px] text-[var(--color-black)]"
          >
            {tag.label}
          </span>
        ))}
      </div>

      <div className="mt-7 leading-[1.5] font-[18px] font-normal text-[var(--color-black)]">
        {question.details.split("\n").map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-7 flex justify-end">
        <button className="font-[18px] font-semibold text-[var(--color-black)]">
          <Link to="" />
          Редактировать
        </button>
      </div>
    </article>
  );
}
