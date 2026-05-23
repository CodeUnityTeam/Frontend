import { useState } from "react";
import { Link, NavLink } from "react-router";
import { Icon } from "@iconify/react";
import Logo from "@/shared/assets/icons/logo.svg";
import Avatar from "@/shared/assets/images/avatar.png";

const isAuth = false;

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `transition-opacity hover:opacity-70 ${
    isActive ? "text-primary font-semibold" : ""
  }`;

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="relative flex items-center justify-between bg-background px-20 py-4 font-['Raleway'] max-md:px-5">
      <Link to="/" className="flex items-center">
        <img src={Logo} alt="logo" />
      </Link>

      <nav className="flex gap-9 text-lg leading-none font-semibold max-md:hidden">
        <NavLink to="/projects" className={linkClass}>
          Проекты
        </NavLink>

        <NavLink to="/users" className={linkClass}>
          Q&A
        </NavLink>

        <NavLink to="/articles" className={linkClass}>
          О нас
        </NavLink>
      </nav>

      <div className="flex items-center gap-10 max-md:gap-4">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="hidden text-2xl max-md:block"
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

      {isOpen && (
        <div className="absolute top-full left-0 flex w-full flex-col gap-6 bg-background px-5 py-6 md:hidden">
          <NavLink
            to="/projects"
            className={linkClass}
            onClick={() => setIsOpen(false)}
          >
            Проекты
          </NavLink>

          <NavLink
            to="/users"
            className={linkClass}
            onClick={() => setIsOpen(false)}
          >
            Q&A
          </NavLink>

          <NavLink
            to="/articles"
            className={linkClass}
            onClick={() => setIsOpen(false)}
          >
            О нас
          </NavLink>

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
      )}
    </header>
  );
}
