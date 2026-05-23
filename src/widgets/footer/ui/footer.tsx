import { Navigation } from "@/shared/ui/navigation";
import { footerNavigation } from "@/shared/config/navigation/footer-navigation";
import TelegramIcon from "@iconify-react/fontisto/telegram";

export function Footer() {
  return (
    <footer className=" font-raleway font-semibold text-[18px] leading-5.25 bg-light-blue ">
      <div className=" mx-auto flex items-center flex-col md:gap-6 md:px-20 md:pt-6 md:pb-5.75 md:flex-row md:justify-between">
        <div className="flex flex-col items-center md:flex-row md:gap-[14.4px] md:order-2">
          <Navigation
            items={footerNavigation}
            listClassName="flex flex-col items-center gap-1 md:flex-row md:gap-4"
            itemClassName="py-4 md:px-5"
          />
          <a
            className="p-5 md:p-0"
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram"
          >
            <TelegramIcon height="48" />
          </a>
        </div>
        <small className="pt-6 pb-4 md:order-1">© 2026 Код Юнити</small>
      </div>
    </footer>
  );
}
