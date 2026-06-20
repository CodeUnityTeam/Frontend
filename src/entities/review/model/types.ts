import type { ReactNode } from "react";

export interface Review {
  id: string;
  author: {
    name: string;
    profession: string;
    avatarUrl: string;
  };
  text: string;
}

export type TWrapperTab = {
  id: string;
  label: string;
};

export type TChatbotWrapperItem = {
  id: string;
  card: ReactNode;
};

export type TChatbotWrapper = {
  title?: string;
  onTabChange?: (tabId: string) => void;

  onPrev?: () => void;
  onNext?: () => void;

  buttonText: string;
  onButtonClick?: () => void;

  className?: string;
};