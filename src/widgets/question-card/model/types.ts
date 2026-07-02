import type { QuestionListItemDto } from "@/entities/question";

export interface UserData {
  firstName: string;
  avatarUrl: string;
  rating: number;
}

export interface QuestionData {
  id: string;
  user: UserData;
  title: string;
  description: string;
  skills: string[];
  createdAt: Date;
  likes: number;
  comments: number;
}

export interface QuestionCardProps {
  question: QuestionListItemDto;
}
