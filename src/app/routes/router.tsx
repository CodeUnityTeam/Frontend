import { createBrowserRouter } from "react-router";
import { App } from "@/app/app";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // layout со всеми providers и sidebar
    children: [
      {
        index: true,
        lazy: () => import("@/pages/home/ui/home-page"),
      },
      {
        path: "projects",
        lazy: () => import("@/pages/projects/projects-page"),
      },
      { path: "qa", lazy: () => import("@/pages/qa/qa-page") },
      { path: "qa/create", lazy: () => import("@/pages/qa-create/qa-create-page") },
      { path: "about", lazy: () => import("@/pages/about/about-page") },
      { path: "help", lazy: () => import("@/pages/help/help-page") },
      {
        path: "documents",
        lazy: () => import("@/pages/documents/documents-page"),
      },
      { path: "account", lazy: () => import("@/pages/account/account-page") },
      {
        path: "account-settings",
        lazy: () => import("@/pages/account-settings/account-settings-page"),
      },
      
      { path: "register", lazy: () => import("@/pages/register/ui/register-page") },
    ],
  },
]);
