import { Navigate } from "react-router";

import { isAuth } from "@/shared/config/mock-config";
import { ROUTES } from "@/shared/model/routes";
import { PageContainer } from "@/shared/ui/page-container";
import {
  FiltersProvider,
  FiltersBar,
  FiltersSidebar,
  FiltersMobile,
} from "@/widgets/filters";
import { Search } from "@/widgets/search";
import { FilterTabs } from "@/widgets/filter-tabs";
import { projectTabs } from "@/widgets/filter-tabs/model/tabs-data";
import { useState } from "react";

function ProjectsPage() {
  const [tab, setTab] = useState("catalog");

  if (!isAuth) {
    return <Navigate to={ROUTES.REGISTER} replace />;
  }

  return (
    <>
      <Search />

      <FiltersProvider>
        <PageContainer className="py-8">
          <FiltersMobile className="mb-6 md:hidden" />
          <FiltersBar className="mb-6 hidden md:flex" />
          
          <div className="md:flex md:items-start md:gap-8">
            <FiltersSidebar className="hidden md:block" />
            <FilterTabs items={projectTabs} value={tab} onValueChange={setTab} />
            <div className="flex-1"></div>
          </div>
        </PageContainer>
      </FiltersProvider>
    </>
  );
}

export const Component = ProjectsPage;
