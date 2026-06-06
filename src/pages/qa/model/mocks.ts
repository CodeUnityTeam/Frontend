import type { UserData, QuestionData } from "@/widgets/question-card/model/types";
import Avatar from "@/shared/assets/images/avatar.png";

const testUser: UserData = {
  firstName: "Анна",
  avatarUrl: Avatar,
  rating: 4
}

export const testQuestion: QuestionData = {
  id: "1",
  user: testUser,
  title: "Как собрать портфолио, если нет коммерческого опыта, но хочется попасть в реальные проекты?",
  description: `Я начинающий разработчик и пока не работал в коммерческих командах. Учебные проекты есть, но они выглядят слишком “учебными”, и я не уверен, что их стоит показывать.
                Как правильно собирать портфолио без реального опыта? Стоит ли участвовать в open-source или лучше искать командные pet-проекты? Хочется получить опыт, который будет полезен для будущего трудоустройства и не тратить время впустую.`,
  skills: ["Дизайн", "Figma"],
  createdAt: new Date(2026, 4, 25),
  likes: 10,
  comments: 3, 
  reposts: 2
}