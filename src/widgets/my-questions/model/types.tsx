export type QuestionTag = {
  id: string;
  label: string;
};

export type QuestionAuthor = {
  name: string;
  avatar: string;
};

export type Question = {
  id: string;
  author: QuestionAuthor;
  likes: number;
  createdAt: string;
  title: string;
  tags: QuestionTag[];
  details: string;
};
