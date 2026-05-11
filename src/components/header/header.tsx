import { Link, NavLink } from "react-router-dom";

import Logo from "@/assets/icons/logo.svg";
import LoginIcon from "@/assets/icons/login.svg";
import Avatar from "@/assets/images/avatar.png";
import BurgerIcon from "@/assets/icons/burger.svg";

import styles from "./header.module.css";

const isAuth = true;

export function Header() {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        <img src={Logo} alt="logo" />
      </Link>

      <nav className={styles.nav}>
        <NavLink
          to="/projects"
          className={({ isActive }) => (isActive ? styles.active : undefined)}
        >
          Проекты
        </NavLink>

        <NavLink
          to="/users"
          className={({ isActive }) => (isActive ? styles.active : undefined)}
        >
          Q&A
        </NavLink>

        <NavLink
          to="/articles"
          className={({ isActive }) => (isActive ? styles.active : undefined)}
        >
          О нас
        </NavLink>
      </nav>

      <div className={styles.auth}>
        <button className={styles.burger}>
          <img src={BurgerIcon} alt="menu" />
        </button>

        {isAuth ? (
          <div className={styles.user}>
            <img className={styles.avatar} src={Avatar} alt="avatar" />
            <span className={styles.username}>Профиль</span>
          </div>
        ) : (
          <Link to="/login" className={styles.login}>
            <img src={LoginIcon} alt="login" />
            Войти
          </Link>
        )}
      </div>
    </header>
  );
}
