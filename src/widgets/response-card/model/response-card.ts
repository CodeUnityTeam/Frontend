import {
  employerInviteStatusMap,
  employerResponseStatusMap,
  workerResponseStatusMap,
  workerInviteStatusMap,
  type StatusConfig,
} from "./status";
import type { ProjectsRelation } from "@/entities/profile";

import type {
  ResponseStatus,
  ResponseInitiatorType,
} from "@/entities/response";

type ResponseCardState = {
  status: StatusConfig;
  actions: {
    canApprove: boolean;
    canWithdraw: boolean;
    canContact: boolean;
    withdrawLabel: string;
    confirmText: string;
  };
};

type ResponseCardStateInput = {
  status: ResponseStatus;
  initiatorType: ResponseInitiatorType;
};


export function getResponseCardState(
  response: ResponseCardStateInput,
  role: ProjectsRelation,
): ResponseCardState {
  const { status, initiatorType } = response;

  const isWorker = role === "worker";
  const isEmployer = role === "employer";

  const isWorkerResponse = initiatorType === "applicant";
  const isEmployerInvite = initiatorType === "author";

  const isPending = status === "pending";
  const isApproved = status === "approved";

  let statusMap;

  if (isWorker && isWorkerResponse) {
    statusMap = workerResponseStatusMap;
  } else if (isWorker && isEmployerInvite) {
    statusMap = workerInviteStatusMap;
  } else if (isEmployer && isWorkerResponse) {
    statusMap = employerResponseStatusMap;
  } else {
    statusMap = employerInviteStatusMap;
  }

  return {
    status: statusMap[status],

    actions: {
      canApprove:
        isPending &&
        ((isWorker && isEmployerInvite) ||
          (isEmployer && isWorkerResponse)),

      canWithdraw:
        isPending &&
        ((isWorker && isWorkerResponse) ||
          (isEmployer && isEmployerInvite)),

      canContact:
        isApproved &&
        ((isWorker && isWorkerResponse) || isEmployer),

      withdrawLabel: isEmployer
        ? "Отозвать приглашение"
        : "Отозвать отклик",

      confirmText: isEmployer
        ? "Вы уверены, что хотите отозвать приглашение?"
        : "Вы уверены, что хотите отозвать отклик?",
    },
  };
}