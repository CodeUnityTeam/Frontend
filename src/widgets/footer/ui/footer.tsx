import { Navigation } from "@/shared/ui/navigation";
import { navigationConfigs } from "@/shared/config/navigation/navigation-config";
import { Icon } from "@iconify/react";
import { useRole } from "@/entities/profile";

export function Footer() {
  const { role } = useRole();
  const isEmployer = role === "employer";

  const footerItems = navigationConfigs.footer.map((item) =>
    item.id === "projects" && isEmployer
      ? { ...item, label: "Отклики" }
      : item
  );
  return (
    <footer className="font-raleway font-semibold text-lg leading-5.25 bg-light-blue">
      <div className="flex items-center flex-col md:gap-6 md:px-20 md:pt-6 md:pb-5.75 md:flex-row md:justify-between">
        <div className="flex flex-col items-center md:flex-row md:gap-[14.4px] md:order-2">
          <Navigation
            items={footerItems}
            listClassName="flex flex-col items-center gap-1 md:flex-row md:gap-4"
            itemClassName="py-4 md:px-5"
          />
          {/* Telegram link */}
          <a
            className="p-5 md:p-0"
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram"
          >
            <Icon icon="fontisto:telegram" height="48" />
          </a>
        </div>
        {/* Copyright */}
        <small className="pt-6 pb-4 md:order-1">© 2026 Код Юнити</small>
      </div>
    </footer>
  );
}
