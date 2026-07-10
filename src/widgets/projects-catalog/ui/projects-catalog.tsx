import type { ReactNode } from "react";

type ProjectsCatalogProps = {
  tab: string;
  catalog: ReactNode;
  favorites: ReactNode;
  responses: ReactNode;
  myProjects: ReactNode;
};

export function ProjectsCatalog({
  tab,
  catalog,
  favorites,
  responses,
  myProjects,
}: ProjectsCatalogProps) {
  const content: Record<string, ReactNode> = {
    catalog,
    favorites,
    responses,
    "my-projects": myProjects,
  };

  return <div className="flex flex-col gap-6">{content[tab] ?? catalog}</div>;
}
