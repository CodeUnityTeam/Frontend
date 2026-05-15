import { Link, NavLink } from "react-router";

import Logo from "@/assets/icons/logo.svg";
import LoginIcon from "@/assets/icons/login.svg";
import Avatar from "@/assets/images/avatar.png";
import BurgerIcon from "@/assets/icons/burger.svg";

const isAuth = false;

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `transition-opacity hover:opacity-70 ${
    isActive ? "text-primary font-semibold" : ""
  }`;

export function Header() {
  return (
    <header className="flex items-center justify-between px-20 py-4 bg-background font-['Raleway'] max-md:px-5">
      {/* Logo */}
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

        <NavLink to="/articles" className={linkClass}>
          О нас
        </NavLink>
      </nav>

      {/* Auth block */}
      <div className="flex justify-end items-center gap-10 max-md:gap-10">
        {/* Burger */}
        <button className="hidden max-md:block text-2xl">
          <img src={BurgerIcon} alt="menu" />
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
            <img
              src={LoginIcon}
              alt="login"
              className="w-4 h-4 max-md:hidden"
            />
            Войти
          </Link>
        )}
      </div>
    </header>
  );
}
