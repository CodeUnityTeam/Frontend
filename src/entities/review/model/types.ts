export interface Review {
  id: string;
  author: {
    name: string;
    profession: string;
    avatarUrl: string;
  };
  text: string;
}
