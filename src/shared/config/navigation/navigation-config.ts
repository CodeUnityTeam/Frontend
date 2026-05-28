import type { NavigationItem } from "@/shared/ui/navigation";

export const navigationConfigs = {
  footer: [
    { id: "projects", label: "Проекты", to: "/projects" },
    { id: "qa", label: "Q&A", to: "/qa" },
    { id: "about", label: "О нас", to: "/about" },
    { id: "help", label: "Помощь", to: "/help" },
    { id: "documents", label: "Документы", to: "/documents" },
  ],

  header: [
    { id: "projects", label: "Проекты", to: "/projects" },
    { id: "qa", label: "Q&A", to: "/qa" },
    { id: "about", label: "О нас", to: "/about" },
  ],
} satisfies Record<string, NavigationItem[]>;