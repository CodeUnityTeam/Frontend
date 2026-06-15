import { Icon as IconifyIcon } from "@iconify/react";

import { cn } from "@/shared/lib/utils";
import MailRuIcon from "@/shared/assets/icons/mail-ru.svg?react";
import YandexIcon from "@/shared/assets/icons/yandex.svg?react";

const localIcons = {
  yandex: YandexIcon,
  "mail-ru": MailRuIcon,
} as const;

type LocalIconName = keyof typeof localIcons;

export type IconName = LocalIconName | (string & {});

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 24, className }: IconProps) {
  if (name in localIcons) {
    const Svg = localIcons[name as LocalIconName];

    return (
      <Svg width={size} height={size} className={cn("shrink-0", className)} />
    );
  }

  return (
    <IconifyIcon
      icon={name}
      width={size}
      height={size}
      className={cn("shrink-0", className)}
    />
  );
}
