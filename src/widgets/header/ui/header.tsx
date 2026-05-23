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
  return (
    <header className="flex items-center justify-between bg-background px-20 py-4 font-['Raleway'] max-md:px-5">
      <Link to="/" className="flex items-center">
        <img src={Logo} alt="logo" />
      </Link>

      {/* Nav */}
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

      <div className="flex items-center justify-end gap-10 max-md:gap-10">
        <button className="hidden text-2xl max-md:block">
          <Icon icon="mdi:menu" />
        </button>

        {isAuth ? (
          <div className="flex cursor-pointer items-center gap-2">
            <img
              src={Avatar}
              alt="avatar"
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className="text-lg font-semibold max-md:hidden">Профиль</span>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <Icon icon="mdi:login" className="h-4 w-4 max-md:hidden" />
            Войти
          </Link>
        )}
      </div>
    </header>
  );
}
