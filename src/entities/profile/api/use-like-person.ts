import {
  useMutation,
  useQueryClient,
  type InfiniteData,
  type QueryKey,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { likePerson } from "@/entities/profile/api/like-person";
import { PEOPLE_QUERY_KEY } from "@/entities/profile/api/use-people";
import { PEOPLE_RESPONSES_QUERY_KEY } from "@/entities/profile/api/use-people-responses";
import type {
  GetPeopleParams,
  PeoplePage,
} from "@/entities/profile/model/types";

type PeopleListData = PeoplePage | InfiniteData<PeoplePage>;

interface LikePersonVars {
  userId: string;
  liked: boolean;
}

function isFavouritesListKey(queryKey: QueryKey): boolean {
  const params = queryKey[1];
  return (
    typeof params === "object" &&
    params !== null &&
    (params as GetPeopleParams).favourites === true
  );
}

function patchPages(patchPage: (page: PeoplePage) => PeoplePage) {
  return (data: PeopleListData | undefined): PeopleListData | undefined => {
    if (!data) {
      return data;
    }
    if ("pages" in data) {
      return { ...data, pages: data.pages.map(patchPage) };
    }
    return patchPage(data);
  };
}

function setLiked(userId: string, liked: boolean) {
  return patchPages((page) => ({
    ...page,
    items: page.items.map((item) =>
      item.userId === userId ? { ...item, isLiked: liked } : item,
    ),
  }));
}

function removePerson(userId: string) {
  return patchPages((page) => {
    const items = page.items.filter((item) => item.userId !== userId);
    if (items.length === page.items.length) {
      return page;
    }
    return { ...page, items, total: Math.max(0, page.total - 1) };
  });
}

export function useLikePerson() {
  const queryClient = useQueryClient();

  const applyLiked = (userId: string, liked: boolean) => {
    queryClient
      .getQueriesData<PeopleListData>({ queryKey: [PEOPLE_QUERY_KEY] })
      .forEach(([queryKey]) => {
        const patch =
          !liked && isFavouritesListKey(queryKey)
            ? removePerson(userId)
            : setLiked(userId, liked);
        queryClient.setQueryData<PeopleListData>(queryKey, patch);
      });
  };

  return useMutation({
    mutationFn: ({ userId }: LikePersonVars) => likePerson(userId),

    onMutate: async ({ userId, liked }) => {
      await queryClient.cancelQueries({ queryKey: [PEOPLE_QUERY_KEY] });

      const prevLists = queryClient.getQueriesData<PeopleListData>({
        queryKey: [PEOPLE_QUERY_KEY],
      });

      applyLiked(userId, liked);

      return { prevLists };
    },

    onError: (error, _vars, context) => {
      context?.prevLists.forEach(([queryKey, data]) =>
        queryClient.setQueryData(queryKey, data),
      );
      toast.error(error.message);
    },

    onSuccess: (isLiked, { userId }) => {
      applyLiked(userId, isLiked);
      queryClient.invalidateQueries({
        queryKey: [PEOPLE_QUERY_KEY],
        predicate: (query) => isFavouritesListKey(query.queryKey),
      });
      queryClient.invalidateQueries({
        queryKey: [PEOPLE_RESPONSES_QUERY_KEY],
      });
    },
  });
}
