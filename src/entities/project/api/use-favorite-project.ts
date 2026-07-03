import {
  useMutation,
  useQueryClient,
  type InfiniteData,
  type QueryKey,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { favoriteProject } from "@/entities/project/api/favorite-project";
import { PROJECTS_QUERY_KEY } from "@/entities/project/api/use-projects";
import { RECOMMENDATIONS_QUERY_KEY } from "@/entities/project/api/use-recommendations";
import type {
  GetProjectsParams,
  ProjectsPage,
} from "@/entities/project/model/types";

type ProjectsListData = ProjectsPage | InfiniteData<ProjectsPage>;

interface FavoriteMutationVars {
  projectId: string;
  favorited: boolean;
}

function isFavouritesListKey(queryKey: QueryKey): boolean {
  const params = queryKey[1];
  return (
    typeof params === "object" &&
    params !== null &&
    (params as GetProjectsParams).favourites === true
  );
}

function patchPages(patchPage: (page: ProjectsPage) => ProjectsPage) {
  return (data: ProjectsListData | undefined): ProjectsListData | undefined => {
    if (!data) {
      return data;
    }
    if ("pages" in data) {
      return { ...data, pages: data.pages.map(patchPage) };
    }
    return patchPage(data);
  };
}

function setFavorited(projectId: string, favorited: boolean) {
  return patchPages((page) => ({
    ...page,
    items: page.items.map((item) =>
      item.projectId === projectId
        ? { ...item, isFavoriteByMe: favorited }
        : item,
    ),
  }));
}

function removeProject(projectId: string) {
  return patchPages((page) => {
    const items = page.items.filter((item) => item.projectId !== projectId);
    if (items.length === page.items.length) {
      return page;
    }
    return { ...page, items, total: Math.max(0, page.total - 1) };
  });
}

export function useFavoriteProject() {
  const queryClient = useQueryClient();

  const applyFavorited = (projectId: string, favorited: boolean) => {
    for (const rootKey of [PROJECTS_QUERY_KEY, RECOMMENDATIONS_QUERY_KEY]) {
      queryClient
        .getQueriesData<ProjectsListData>({ queryKey: [rootKey] })
        .forEach(([queryKey]) => {
          const patch =
            !favorited && isFavouritesListKey(queryKey)
              ? removeProject(projectId)
              : setFavorited(projectId, favorited);
          queryClient.setQueryData<ProjectsListData>(queryKey, patch);
        });
    }
  };

  return useMutation({
    mutationFn: ({ projectId }: FavoriteMutationVars) =>
      favoriteProject(projectId),

    onMutate: async ({ projectId, favorited }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: [PROJECTS_QUERY_KEY] }),
        queryClient.cancelQueries({ queryKey: [RECOMMENDATIONS_QUERY_KEY] }),
      ]);

      const prevLists = [
        ...queryClient.getQueriesData<ProjectsListData>({
          queryKey: [PROJECTS_QUERY_KEY],
        }),
        ...queryClient.getQueriesData<ProjectsListData>({
          queryKey: [RECOMMENDATIONS_QUERY_KEY],
        }),
      ];

      applyFavorited(projectId, favorited);

      return { prevLists };
    },

    onError: (error, _vars, context) => {
      context?.prevLists.forEach(([queryKey, data]) =>
        queryClient.setQueryData(queryKey, data),
      );
      toast.error(error.message);
    },

    onSuccess: (data, { projectId }) => {
      applyFavorited(projectId, data.favorited);
      queryClient.invalidateQueries({
        queryKey: [PROJECTS_QUERY_KEY],
        predicate: (query) => isFavouritesListKey(query.queryKey),
      });
    },
  });
}
