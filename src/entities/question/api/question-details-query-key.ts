export const QUESTION_DETAILS_QUERY_KEY = "question-details" as const;

export function getQuestionDetailsQueryKey(questionId?: string) {
  return questionId
    ? ([QUESTION_DETAILS_QUERY_KEY, questionId] as const)
    : ([QUESTION_DETAILS_QUERY_KEY] as const);
}
