import { createBrowserRouter } from "react-router";
import { lazy } from "react";
import { App } from "@/app/app";
import { ProtectedRoute } from "@/shared/ui/protected-route/protected-route";
import { ROUTES } from "@/shared/model/routes";

const RegisterPage = lazy(() =>
  import("@/pages/register/ui/register-page").then((m) => ({
    default: m.Component,
  })),
);
const CheckEmailPage = lazy(() =>
  import("@/pages/register/ui/check-email-page").then((m) => ({
    default: m.Component,
  })),
);
const VerifyEmailPage = lazy(() =>
  import("@/pages/register/ui/verify-email-page").then((m) => ({
    default: m.Component,
  })),
);
const ResetPasswordConfirmPage = lazy(() =>
  import("@/pages/reset-password/reset-password-confirm-page").then((m) => ({
    default: m.Component,
  })),
);
const ProjectsPage = lazy(() =>
  import("@/pages/projects/projects-page").then((m) => ({
    default: m.Component,
  })),
);
const ProjectDetails = lazy(() =>
  import("@/pages/project-details/project-details").then((m) => ({
    default: m.Component,
  })),
);
const QAPage = lazy(() =>
  import("@/pages/qa/qa-page").then((m) => ({ default: m.Component })),
);
const QADetailsPage = lazy(() =>
  import("@/pages/qa-details/qa-details-page").then((m) => ({
    default: m.Component,
  })),
);
const QACreatePage = lazy(() =>
  import("@/pages/qa-create/qa-create-page").then((m) => ({
    default: m.Component,
  })),
);
const QAEditPage = lazy(() =>
  import("@/pages/qa-edit/qa-edit-page").then((m) => ({
    default: m.Component,
  })),
);
const ProfilePage = lazy(() =>
  import("@/pages/profile/profile-page").then((m) => ({
    default: m.Component,
  })),
);
const SettingsPage = lazy(() =>
  import("@/pages/settings/settings-page").then((m) => ({
    default: m.Component,
  })),
);
const AccountPage = lazy(() =>
  import("@/pages/account/account-page").then((m) => ({
    default: m.Component,
  })),
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        lazy: () => import("@/pages/home/ui/home-page"),
      },
      {
        path: ROUTES.ONBOARDING,
        element: (
          <ProtectedRoute>
            <RegisterPage />
          </ProtectedRoute>
        ),
      },
      { path: ROUTES.REGISTER_CHECK_EMAIL, element: <CheckEmailPage /> },
      { path: ROUTES.REGISTER_VERIFY_EMAIL, element: <VerifyEmailPage /> },
      {
        path: ROUTES.REGISTER_VERIFY_EMAIL_FALLBACK,
        element: <VerifyEmailPage />,
      },
      {
        path: ROUTES.RESET_PASSWORD_CONFIRM,
        element: <ResetPasswordConfirmPage />,
      },
      {
        path: ROUTES.PROJECTS,
        element: <ProjectsPage />,
      },
      {
        path: "projects/:id",
        element: (
          <ProtectedRoute>
            <ProjectDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.QA,
        element: <QAPage />,
      },
      {
        path: ROUTES.QA_DETAILS,
        element: (
          <ProtectedRoute>
            <QADetailsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.QA_CREATE,
        element: (
          <ProtectedRoute>
            <QACreatePage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.QA_EDIT,
        element: (
          <ProtectedRoute>
            <QAEditPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ABOUT,
        lazy: () => import("@/pages/about/about-page"),
      },
      {
        path: ROUTES.HELP,
        lazy: () => import("@/pages/help/help-page"),
      },
      {
        path: ROUTES.DOCUMENTS,
        lazy: () => import("@/pages/documents/documents-page"),
      },
      {
        path: ROUTES.PROFILE,
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.SETTINGS,
        element: (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ACCOUNT,
        element: (
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.FORBIDDEN,
        lazy: () => import("@/pages/error-pages/page-403"),
      },
      {
        path: ROUTES.NOT_FOUND,
        lazy: () => import("@/pages/error-pages/page-404"),
      },
      {
        path: ROUTES.SERVER_ERROR,
        lazy: () => import("@/pages/error-pages/page-500"),
      },
      {
        path: "/auth/callback",
        lazy: () => import("@/pages/oauth-callback/oauth-callback"),
      },
      {
        path: "*",
        lazy: () => import("@/pages/error-pages/page-404"),
      },
    ],
  },
]);
