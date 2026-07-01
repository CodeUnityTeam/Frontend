import { apiClient } from "./api-client";

export type ReviewSpecialization = {
  spec_id: string;
  name: string;
};

export type Review = {
  review_id: string;
  author_name: string;
  author_avatar: string | null;
  author_specializations: ReviewSpecialization[];
  text: string;
  created_at: string;
  updated_at?: string;
};

export async function getReviews(): Promise<Review[]> {
  const { data } = await apiClient.get<Review[]>("/reviews/");
  return data;
}

export async function createReview(text: string): Promise<Review> {
  const { data } = await apiClient.post<Review>("/reviews/", { text });
  return data;
}

export async function updateReview(reviewId: string, text: string): Promise<Review> {
  const { data } = await apiClient.patch<Review>(`/reviews/${reviewId}/`, { text });
  return data;
}

export async function deleteReview(reviewId: string): Promise<void> {
  await apiClient.delete(`/reviews/${reviewId}/`);
}