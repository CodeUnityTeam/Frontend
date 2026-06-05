import { cn } from "@/shared/lib/utils";
import { Search } from "@/widgets/search";
import { TagsList } from "@/widgets/tags";

const QAPage = () => {
  return (
    <>
    <Search/>
    <div className={cn(
      "px-[clamp(1rem,calc(1rem+(100vw-20rem)*64/1120),5rem)]",
    )}>
      <TagsList />
    </div>
    </>
  )
}

export const Component = QAPage;