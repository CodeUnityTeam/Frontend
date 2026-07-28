import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import type { TabItem } from "../model/types";

type FilterTabsProps<TValue extends string> = {
  items: readonly TabItem<TValue>[];
  value: TValue;
  onValueChange: (value: TValue) => void;
};

export function FilterTabs<TValue extends string>({
  items,
  value,
  onValueChange,
}: FilterTabsProps<TValue>) {
  return (
    <Tabs
      value={value}
      onValueChange={(nextValue) => onValueChange(nextValue as TValue)}
      className="overflow-x-auto scrollbar-none"
    >
      <TabsList className="gap-[15px] lg:gap-5 p-0 h-[59px] justify-start">
        {items.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
