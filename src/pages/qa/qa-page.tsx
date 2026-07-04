import { FiltersProvider } from "@/widgets/filters";
import { QAPageContent } from "@/pages/qa/qa-page-content";

const QAPage = () => (
  <FiltersProvider>
    <QAPageContent />
  </FiltersProvider>
);

export const Component = QAPage;