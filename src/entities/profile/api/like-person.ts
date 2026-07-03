import { apiClient } from "@/shared/api";

interface PersonLikeResponseDto {
  is_liked: boolean;
}

export async function likePerson(workerId: string): Promise<boolean> {
  const { data } = await apiClient.post<PersonLikeResponseDto>(
    `/user/profile/${workerId}/like/`,
  );

  return data.is_liked;
}
