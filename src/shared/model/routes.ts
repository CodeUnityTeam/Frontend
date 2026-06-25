import "react-router";

/**
 * Константы URL. Добавляй сегменты с `:имя` там, где нужен динамический параметр.
 * Дальше для каждого такого пути допиши запись в `PathParams` (тем же литералом пути).
 *
 * `declare module "react-router"` + `Register.params` — чтобы `useParams()` знал типы
 * по текущему маршруту (см. доку react-router про типизацию роутов).
 */
export const ROUTES = {
  HOME: "/",
  NOT_FOUND: "/404",
  FORBIDDEN: "/403",
  ERROR_500: "/500",
  REGISTER: "/register",
  REGISTER_CHECK_EMAIL: "/register/check-email",
  REGISTER_VERIFY_EMAIL: "/register/verify-email/:key",
  REGISTER_VERIFY_EMAIL_FALLBACK: "/:key",
  RESET_PASSWORD_CONFIRM: "/password-reset/confirm/:uid/:token",

  QA: "/qa",
  QA_CREATE: "/qa/create",
  QA_EDIT: "/qa/:id/edit",

  PROFILE: "/profile",
  SETTINGS: "/settings",

  /*
   * пример: путь с параметром
   * ROUTES.NAME_PAGE_1: "/name_page_1/:id"
   *
   * в PathParams ниже добавь
   * [ROUTES.NAME_PAGE_1]: { id: string }
   * */
  NAME_PAGE_1: "/name_page_1/:id",
} as const;

export type PathParams = {
  [ROUTES.REGISTER_VERIFY_EMAIL]: {
    key: string;
  };
  [ROUTES.REGISTER_VERIFY_EMAIL_FALLBACK]: {
    key: string;
  };
  [ROUTES.NAME_PAGE_1]: {
    id: string;
  };
  [ROUTES.QA_EDIT]: {
    id: string;
  };
  [ROUTES.RESET_PASSWORD_CONFIRM]: {
    uid: string;
    token: string;
  }
};

declare module "react-router" {
  interface Register {
    params: PathParams;
  }
}
