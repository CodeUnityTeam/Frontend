import type { QuestionAnswerDto, QuestionDetailDto } from "./get-question";

function updateQuestionDetailAnswers(
  detail: QuestionDetailDto | undefined,
  updater: (answer: QuestionAnswerDto) => QuestionAnswerDto | null,
): QuestionDetailDto | undefined {
  if (!detail) {
    return detail;
  }

  let changed = false;
  const answers = detail.answers.reduce<QuestionAnswerDto[]>(
    (result, answer) => {
      const next = updater(answer);

      if (next === null) {
        changed = true;
        return result;
      }

      if (next !== answer) {
        changed = true;
      }

      result.push(next);
      return result;
    },
    [],
  );

  return changed ? { ...detail, answers } : detail;
}

export function patchQuestionDetailAnswerLikes(
  detail: QuestionDetailDto | undefined,
  answerId: string,
  liked: boolean,
  likesCount?: number,
): QuestionDetailDto | undefined {
  return updateQuestionDetailAnswers(detail, (answer) =>
    answer.answer_id !== answerId
      ? answer
      : {
          ...answer,
          is_liked_by_me: liked,
          likes_count:
            likesCount ?? Math.max(0, answer.likes_count + (liked ? 1 : -1)),
        },
  );
}

export function removeQuestionDetailAnswer(
  detail: QuestionDetailDto | undefined,
  answerId: string,
): QuestionDetailDto | undefined {
  return updateQuestionDetailAnswers(detail, (answer) =>
    answer.answer_id === answerId ? null : answer,
  );
}
