import type { QuestionItem } from "@/entities/question";
import type { QuestionData } from "@/widgets/question-card/model/types";

export function mapQuestion(item: QuestionItem): QuestionData {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    skills: item.tags,
    createdAt: new Date(item.createdAt),
    likes: item.likesCount,
    comments: item.answersCount,
    user: {
      firstName: item.authorName,
      avatarUrl: "",
      rating: item.authorRating
    }
  }
}