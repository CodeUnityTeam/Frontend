import type { QuestionAnswerDto } from "@/entities/question";

import type { AnswerSortMode, QuestionAnswerNode } from "./types";

function compareAnswersByDate(left: QuestionAnswerDto, right: QuestionAnswerDto) {
  return (
    new Date(left.created_at).getTime() - new Date(right.created_at).getTime()
  );
}

function compareAnswers(
  left: QuestionAnswerDto,
  right: QuestionAnswerDto,
  sortMode: AnswerSortMode,
) {
  if (sortMode === "likes") {
    const likesDelta = right.likes_count - left.likes_count;
    if (likesDelta !== 0) {
      return likesDelta;
    }
  }

  return compareAnswersByDate(left, right);
}

export function buildAnswerTree(
  answers: QuestionAnswerDto[],
  sortMode: AnswerSortMode,
): QuestionAnswerNode[] {
  const nodes = new Map<string, QuestionAnswerNode>();
  const roots: QuestionAnswerNode[] = [];

  for (const answer of answers) {
    nodes.set(answer.answer_id, {
      ...answer,
      replies: [],
    });
  }

  for (const node of nodes.values()) {
    if (node.parent_answer_id) {
      const parent = nodes.get(node.parent_answer_id);
      if (parent) {
        parent.replies.push(node);
        continue;
      }
    }

    roots.push(node);
  }

  const sortTree = (items: QuestionAnswerNode[]) => {
    items.sort((left, right) => compareAnswers(left, right, sortMode));
    items.forEach((item) => {
      if (item.replies.length > 0) {
        sortTree(item.replies);
      }
    });
  };

  sortTree(roots);
  return roots;
}
