import { Link, NavLink } from "react-router";
import { Icon } from "@iconify/react";
import Logo from "@/shared/assets/icons/logo.svg";
import Avatar from "@/shared/assets/images/avatar.png";

const isAuth = false;

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `transition-opacity hover:opacity-70 ${isActive ? "text-primary font-semibold" : ""
  }`;

export function Header() {
  return (
    <header className="flex items-center justify-between px-20 py-4 bg-background font-['Raleway'] max-md:px-5">
      <Link to="/" className="flex items-center">
        <img src={Logo} alt="logo" />
      </Link>

      {/* Nav */}
      <nav className="flex gap-9 font-semibold text-lg leading-none max-md:hidden">
        <NavLink to="/projects" className={linkClass}>
          Проекты
        </NavLink>

        <NavLink to="/users" className={linkClass}>
          Q&A
        </NavLink>

        <NavLink to="/about" className={linkClass}>
          О нас
        </NavLink>
      </nav>

      <div className="flex justify-end items-center gap-10 max-md:gap-10">
        <button className="hidden max-md:block text-2xl">
          <Icon icon="mdi:menu" />
        </button>

        {isAuth ? (
          <div className="flex items-center gap-2 cursor-pointer">
            <img
              src={Avatar}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="font-semibold text-lg max-md:hidden">Профиль</span>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 font-semibold text-lg"
          >
            <Icon
              icon="mdi:login"
              className="w-4 h-4 max-md:hidden"
            />
            Войти
          </Link>
        )}
      </div>
    </header>
  );
}
