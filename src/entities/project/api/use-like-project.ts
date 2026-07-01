import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { likeProject } from "@/entities/project/api/like-project";
import { PROJECTS_QUERY_KEY } from "@/entities/project/api/use-projects";
import type {
  ProjectDetails,
  ProjectsPage,
} from "@/entities/project/model/types";

const PROJECT_DETAILS_QUERY_KEY = "project-details" as const;

type ProjectsListData = ProjectsPage | InfiniteData<ProjectsPage>;

interface LikeMutationVars {
  projectId: string;

  liked: boolean;
}

function patchListLiked(projectId: string, liked: boolean) {
  return (data: ProjectsListData | undefined): ProjectsListData | undefined => {
    if (!data) {
      return data;
    }

    const patchPage = (page: ProjectsPage): ProjectsPage => ({
      ...page,
      items: page.items.map((item) =>
        item.projectId === projectId ? { ...item, isLikedByMe: liked } : item,
      ),
    });

    if ("pages" in data) {
      return { ...data, pages: data.pages.map(patchPage) };
    }
    return patchPage(data);
  };
}

function patchDetailLiked(
  projectId: string,
  liked: boolean,
  likesCount?: number,
) {
  return (detail: ProjectDetails | undefined): ProjectDetails | undefined => {
    if (!detail || detail.project_id !== projectId) {
      return detail;
    }
    return {
      ...detail,
      is_liked_by_me: liked,
      likes_count:
        likesCount ?? Math.max(0, detail.likes_count + (liked ? 1 : -1)),
    };
  };
}

export function useLikeProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId }: LikeMutationVars) => likeProject(projectId),

    onMutate: async ({ projectId, liked }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: [PROJECTS_QUERY_KEY] }),
        queryClient.cancelQueries({ queryKey: [PROJECT_DETAILS_QUERY_KEY] }),
      ]);

      const prevLists = queryClient.getQueriesData<ProjectsListData>({
        queryKey: [PROJECTS_QUERY_KEY],
      });
      const prevDetails = queryClient.getQueriesData<ProjectDetails>({
        queryKey: [PROJECT_DETAILS_QUERY_KEY],
      });

      queryClient.setQueriesData<ProjectsListData>(
        { queryKey: [PROJECTS_QUERY_KEY] },
        patchListLiked(projectId, liked),
      );
      queryClient.setQueriesData<ProjectDetails>(
        { queryKey: [PROJECT_DETAILS_QUERY_KEY] },
        patchDetailLiked(projectId, liked),
      );

      return { prevLists, prevDetails };
    },

    onError: (_error, _vars, context) => {
      context?.prevLists.forEach(([key, data]) =>
        queryClient.setQueryData(key, data),
      );
      context?.prevDetails.forEach(([key, data]) =>
        queryClient.setQueryData(key, data),
      );
      toast.error("Не удалось обновить избранное. Попробуйте ещё раз.");
    },

    onSuccess: (data, { projectId }) => {
      queryClient.setQueriesData<ProjectsListData>(
        { queryKey: [PROJECTS_QUERY_KEY] },
        patchListLiked(projectId, data.liked),
      );
      queryClient.setQueriesData<ProjectDetails>(
        { queryKey: [PROJECT_DETAILS_QUERY_KEY] },
        patchDetailLiked(projectId, data.liked, data.likesCount),
      );
    },
  });
}
