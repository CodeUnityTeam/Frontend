import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

type TTab = {
  id: string;
  label: string;
};

type TChatbotTabs = {
  tabs: TTab[];
  activeTab: string;
  onTabChange?: (tabId: string) => void;
};

export function ChatbotTabs({ tabs, activeTab, onTabChange }: TChatbotTabs) {
  return (
    <div
      className="inline-flex rounded-[var(--radius-lg)]"
      style={{ background: "var(--color-white)" }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <Button
            key={tab.id}
            type="button"
            variant="ghost"
            onClick={() => onTabChange?.(tab.id)}
            className={cn(
              "h-12 px-6 font-[18px] font-semibold",
              isActive
                ? "text-[var(--color-black)]"
                : "text-[var(--color-gray)]",
            )}
          >
            {tab.label}
          </Button>
        );
      })}
    </div>
  );
}
