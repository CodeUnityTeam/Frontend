import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getReviews, createReview, updateReview, deleteReview } from "@/shared/api/reviews";

export const reviewsKeys = {
  all: ["reviews"] as const,
  lists: () => [...reviewsKeys.all, "list"] as const,
  details: () => [...reviewsKeys.all, "detail"] as const,
  detail: (id: string) => [...reviewsKeys.details(), id] as const,
};

export function useReviews() {
  return useQuery({
    queryKey: reviewsKeys.lists(),
    queryFn: getReviews,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (text: string) => createReview(text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewsKeys.lists() });
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, text }: { reviewId: string; text: string }) =>
      updateReview(reviewId, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewsKeys.lists() });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewsKeys.lists() });
    },
  });
}