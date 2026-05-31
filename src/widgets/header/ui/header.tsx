import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Icon } from "@iconify/react";
import Logo from "@/shared/assets/icons/logo.svg";
import Avatar from "@/shared/assets/images/avatar.png";
import { navigationConfigs } from "@/shared/config";
import { Button } from "@/shared/ui/button";
import { Navigation } from "@/shared/ui/navigation";
import { isAuth } from "@/shared/config/mock-config";
import { useModal } from "@/shared/lib/hooks";

import { AuthModal } from "@/shared/ui/modal/auth-modal"; // тестовая модалка

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { open, onOpenChange, openModal } = useModal(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header className="relative z-50 flex items-center justify-between bg-background px-20 py-4 font-['Raleway'] max-md:px-5">
      <Link to="/" className="flex items-center">
        <img src={Logo} alt="logo" />
      </Link>

      <Navigation items={navigationConfigs['header']}
        listClassName="flex gap-9 text-lg font-semibold max-md:hidden" />

      <div className="flex items-center gap-10 max-md:gap-4">
        <Button
          variant="ghost"
          onClick={() => setIsOpen(true)}
          className="relative z-50 hidden text-2xl max-md:block"
          aria-label="Открыть меню"
        >
          <Icon icon="ph:list" height={24} />
        </Button>

        <div className="flex cursor-pointer items-center gap-2">
          {isAuth ? (
            <>
              <img
                src={Avatar}
                alt="avatar"
                className="h-8 w-8 rounded-full object-cover md:h-10 md:w-10"
              />
              <span className="hidden text-lg font-semibold md:inline">Профиль</span>            </>
          ) : (
            <Button
              onClick={openModal} // для тестовой модалки
              variant="ghost"
              size="sm"
              className="flex items-center gap-1.5 px-2 py-1 text-sm font-semibold"
            >
              <Icon
                icon="ph:sign-in" height={24}
                className="h-3.5 w-3.5"
              />
              Войти
            </Button>
          )}
        </div>
      </div>

      <div
        className={
          `fixed inset-0 z-50 transition-opacity 
          duration-300 md:hidden 
          ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
      >
        <div
          className="absolute inset-0 bg-background/60 backdrop-blur-md"
          onClick={() => setIsOpen(false)}
        />

        <div
          className={`absolute top-0 left-0 flex h-full w-[70%] flex-col gap-6 border-r border-border bg-background px-6 py-8 shadow-2xl transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <Button
            variant="ghost"
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-2xl"
            aria-label="Закрыть меню"
          >
            <Icon icon="mdi:close" />
          </Button>

          <div className="mt-10 flex flex-col gap-6">
            <Navigation
              items={navigationConfigs.header}
              listClassName="flex flex-col gap-6 text-md font-semibold"
              onItemClick={() => setIsOpen(false)}

            />
          </div>
        </div>
      </div >
      <AuthModal //тестовая модалка
        open={open} 
        onOpenChange={onOpenChange} 
      />
    </header >
  );
}
