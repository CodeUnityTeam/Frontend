import type { ReactNode } from "react";

import { FiltersContext } from "../model/filters-context";
import { useFiltersController } from "../model/use-filters";

type FiltersProviderProps = {
  children: ReactNode;
};

/** Хранит общее состояние фильтров для desktop-панели, бара и мобильного листа. */
export function FiltersProvider({ children }: FiltersProviderProps) {
  const controller = useFiltersController();

  return (
    <FiltersContext.Provider value={controller}>
      {children}
    </FiltersContext.Provider>
  );
}
