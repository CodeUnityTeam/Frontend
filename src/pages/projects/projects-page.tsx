import { PageContainer } from "@/shared/ui/page-container";
import {
  FiltersProvider,
  FiltersBar,
  FiltersSidebar,
  FiltersMobile,
} from "@/widgets/filters";

function ProjectsPage() {
  return (
    <FiltersProvider>
      <PageContainer className="py-8">
        <FiltersMobile className="mb-6 md:hidden" />
        <FiltersBar className="mb-6 hidden md:flex" />

        <div className="md:flex md:items-start md:gap-8">
          <FiltersSidebar className="hidden md:block" />

          <div className="flex-1"></div>
        </div>
      </PageContainer>
    </FiltersProvider>
  );
}

export const Component = ProjectsPage;
