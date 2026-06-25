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
