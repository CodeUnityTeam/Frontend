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
  created_at: string;
  likes_count: number;
  answers_count: number;
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
  createdAt: string;
  likesCount: number;
  answersCount: number;
}

export interface QuestionsPage {
  items: QuestionItem[];
  count: number;
  hasMore: boolean;
}