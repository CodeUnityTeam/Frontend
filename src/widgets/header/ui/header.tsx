import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router";
import { Icon } from "@iconify/react";
import Logo from "@/shared/assets/icons/logo.svg";
import Avatar from "@/shared/assets/images/avatar.png";
import { navItems } from "../config/navItems";

const isAuth = true;

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `transition-opacity hover:opacity-70 ${
    isActive ? "text-primary font-semibold" : ""
  }`;

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const renderNavItems = (onClick?: () => void) =>
    navItems.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        className={linkClass}
        onClick={onClick}
      >
        {item.label}
      </NavLink>
    ));

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

      <nav className="flex gap-9 text-lg font-semibold max-md:hidden">
        {renderNavItems()}
      </nav>

      <div className="flex items-center gap-10 max-md:gap-4">
        <button
          onClick={() => setIsOpen(true)}
          className="relative z-50 hidden text-2xl max-md:block"
        >
          <Icon icon="mdi:menu" />
        </button>

        <div className="flex cursor-pointer items-center gap-2 max-md:hidden">
          {isAuth ? (
            <>
              <img
                src={Avatar}
                alt="avatar"
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="text-lg font-semibold">Профиль</span>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Icon icon="mdi:login" className="h-4 w-4" />
              Войти
            </Link>
          )}
        </div>

        <div className="hidden items-center gap-2 max-md:flex">
          {isAuth && (
            <img
              src={Avatar}
              alt="avatar"
              className="h-8 w-8 rounded-full object-cover"
            />
          )}
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className="absolute inset-0 bg-background/60 backdrop-blur-md"
          onClick={() => setIsOpen(false)}
        />

        <div
          className={`absolute top-0 left-0 flex h-full w-[70%] flex-col gap-6 border-r border-border bg-background px-6 py-8 shadow-2xl transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-2xl"
          >
            <Icon icon="mdi:close" />
          </button>

          <div className="mt-10 flex flex-col gap-6">
            {renderNavItems(() => setIsOpen(false))}

            {!isAuth && (
              <Link
                to="/login"
                className="flex items-center gap-2 pt-4 text-lg font-semibold"
                onClick={() => setIsOpen(false)}
              >
                <Icon icon="mdi:login" className="h-4 w-4" />
                Войти
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
