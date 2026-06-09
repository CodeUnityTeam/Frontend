import { createContext, useContext } from "react";

import type { FiltersController } from "./types";

export const FiltersContext = createContext<FiltersController | null>(null);

export function useFilters(): FiltersController {
  const context = useContext(FiltersContext);

  if (!context) {
    throw new Error(
      "useFilters должен использоваться внутри <FiltersProvider />",
    );
  }

  return context;
}
