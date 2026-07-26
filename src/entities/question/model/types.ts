export type QuestionTag = string;

export type Question = {
  id: string;
  title: string;
  details: string;
  tags: QuestionTag[];
};

export type QuestionFormValues = {
  title: string;
  details: string;
  tags: QuestionTag[];
};

export interface Skill {
  skillId: string;
  name: string;
}

export interface QuestionDto {
  question_id: string;
  title: string;
  description: string;
  tags: string[];
  author_name: string;
  author_rating: number;
  author_avatar: string;
  created_at: string;
  likes_count: number;
  answers_count: number;
  is_liked_by_me: boolean;
}

export interface GetQuestionsResponse {
  items: QuestionDto[];
  total: number;
  has_more: boolean;
}

export type QuestionsFilter = 'popular' | 'no_answers'| 'my';

export interface GetQuestionsParams {
  filter?: QuestionsFilter;
  limit?: number;
  offset?: number;
  search?: string;
  tags?: string[];
}

export interface QuestionItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  authorName: string;
  authorRating: number;
  authorAvatar: string;
  createdAt: string;
  likesCount: number;
  answersCount: number;
  isLikedByMe: boolean;
}

export interface QuestionsPage {
  items: QuestionItem[];
  total: number;
  hasMore: boolean;
}
