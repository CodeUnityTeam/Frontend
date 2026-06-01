import { createBrowserRouter } from "react-router";
import { App } from "@/app/app";
import AboutPage from "@/pages/about/about-page";
import { HomePage } from "@/pages/home/ui/home-page";
import FaqPage from "@/pages/faq/faq-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // layout со всеми providers и sidebar
    children: [
      { path: "about", element: <AboutPage /> },
      { path: "faq", element: <FaqPage />},
      {
        index: true,
        element: <HomePage />,
      },
      /*
       * Пример навигации по страницам:
       * - Страницы находятся в папке src/pages/[name_page]/[name_page]-page.tsx
       * - Имя страницы должно совпадать с именем папки
       * - Имя страницы должно быть в kebab-case
       *
       * { path: "projects", lazy: () => import("@/pages/projects/projects-page") }
       * { path: "users", lazy: () => import("@/pages/users/users-page") }
       * { path: "articles", lazy: () => import("@/pages/articles/articles-page") }
       *
       * { path: "login", lazy: () => import("@/pages/login/login-page") }
       * { path: "*", lazy: () => import("@/pages/404/404-page") }
       */
    ],
  },
]);
