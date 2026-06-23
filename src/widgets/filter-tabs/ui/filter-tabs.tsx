import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import type { TabItem } from "../model/types";

type FilterTabsProps = {
  items: TabItem[];
  value: string;
  onValueChange: (value: string) => void;
};

export function FilterTabs ({
  items,
  value,
  onValueChange,
}: FilterTabsProps) {
  return (
    <Tabs value={value} onValueChange={onValueChange} className="overflow-x-auto scrollbar-none">
      <TabsList className="gap-[15px] lg:gap-5 p-0 h-[59px] justify-start">
        {items.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}