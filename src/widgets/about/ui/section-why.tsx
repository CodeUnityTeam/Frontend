import { Icon } from "@iconify/react";

export function SectionWhy({ image, text }: { image: string, text: string }) {
  return (
    <div className="flex gap-2 md:gap-4 mbe-2">
      <Icon icon={image} height="24" />
      <p>
        {text}
      </p>
    </div>
  );
}