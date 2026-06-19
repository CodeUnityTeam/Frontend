import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import { App } from "@/app/app";
import { ProtectedRoute } from "@/shared/ui/protected-route/protected-route";
import { ROUTES } from "@/shared/model/routes";


const HomePage = lazy(() => import("@/pages/home/ui/home-page").then(m => ({ default: m.Component })));
const LoginPage = lazy(() => import("@/pages/login/ui/login-page").then(m => ({ default: m.Component })));
const RegisterPage = lazy(() => import("@/pages/register/ui/register-page").then(m => ({ default: m.Component })));
const CheckEmailPage = lazy(() => import("@/pages/register/ui/check-email-page").then(m => ({ default: m.Component })));
const VerifyEmailPage = lazy(() => import("@/pages/register/ui/verify-email-page").then(m => ({ default: m.Component })));
const ProjectsPage = lazy(() => import("@/pages/projects/projects-page").then(m => ({ default: m.Component })));
const ProjectDetails = lazy(() => import("@/pages/project-details/project-details").then(m => ({ default: m.Component })));
const QAPage = lazy(() => import("@/pages/qa/qa-page").then(m => ({ default: m.Component })));
const QACreatePage = lazy(() => import("@/pages/qa-create/qa-create-page").then(m => ({ default: m.Component })));
const QAEditPage = lazy(() => import("@/pages/qa-edit/qa-edit-page").then(m => ({ default: m.Component })));
const AboutPage = lazy(() => import("@/pages/about/about-page").then(m => ({ default: m.Component })));
const HelpPage = lazy(() => import("@/pages/help/help-page").then(m => ({ default: m.Component })));
const DocumentsPage = lazy(() => import("@/pages/documents/documents-page").then(m => ({ default: m.Component })));
const ProfilePage = lazy(() => import("@/pages/profile/profile-page").then(m => ({ default: m.Component })));
const SettingsPage = lazy(() => import("@/pages/settings/settings-page").then(m => ({ default: m.Component })));
const AccountPage = lazy(() => import("@/pages/account/account-page").then(m => ({ default: m.Component })));
const Page403 = lazy(() => import("@/pages/error-pages/page-403").then(m => ({ default: m.Component })));
const Page404 = lazy(() => import("@/pages/error-pages/page-404").then(m => ({ default: m.Component })));
const Page500 = lazy(() => import("@/pages/error-pages/page-500").then(m => ({ default: m.Component })));


function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div>Загрузка...</div>}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <HomePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: ROUTES.LOGIN,
        element: (
          <SuspenseWrapper>
            <LoginPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: ROUTES.REGISTER,
        element: (
          <SuspenseWrapper>
            <RegisterPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: ROUTES.REGISTER_CHECK_EMAIL,
        element: (
          <SuspenseWrapper>
            <CheckEmailPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: ROUTES.REGISTER_VERIFY_EMAIL,
        element: (
          <SuspenseWrapper>
            <VerifyEmailPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: ROUTES.REGISTER_VERIFY_EMAIL_FALLBACK,
        element: (
          <SuspenseWrapper>
            <VerifyEmailPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: ROUTES.PROJECTS,
        element: (
          <ProtectedRoute>
            <SuspenseWrapper>
              <ProjectsPage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "projects/:id",
        element: (
          <ProtectedRoute>
            <SuspenseWrapper>
              <ProjectDetails />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.QA,
        element: (
          <ProtectedRoute>
            <SuspenseWrapper>
              <QAPage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.QA_CREATE,
        element: (
          <ProtectedRoute>
            <SuspenseWrapper>
              <QACreatePage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.QA_EDIT,
        element: (
          <ProtectedRoute>
            <SuspenseWrapper>
              <QAEditPage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ABOUT,
        element: (
          <ProtectedRoute>
            <SuspenseWrapper>
              <AboutPage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.HELP,
        element: (
          <ProtectedRoute>
            <SuspenseWrapper>
              <HelpPage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.DOCUMENTS,
        element: (
          <ProtectedRoute>
            <SuspenseWrapper>
              <DocumentsPage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.PROFILE,
        element: (
          <ProtectedRoute>
            <SuspenseWrapper>
              <ProfilePage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.SETTINGS,
        element: (
          <ProtectedRoute>
            <SuspenseWrapper>
              <SettingsPage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ACCOUNT,
        element: (
          <ProtectedRoute>
            <SuspenseWrapper>
              <AccountPage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.FORBIDDEN,
        element: (
          <SuspenseWrapper>
            <Page403 />
          </SuspenseWrapper>
        ),
      },
      {
        path: ROUTES.NOT_FOUND,
        element: (
          <SuspenseWrapper>
            <Page404 />
          </SuspenseWrapper>
        ),
      },
      {
        path: ROUTES.SERVER_ERROR,
        element: (
          <SuspenseWrapper>
            <Page500 />
          </SuspenseWrapper>
        ),
      },
      {
        path: "*",
        element: (
          <SuspenseWrapper>
            <Page404 />
          </SuspenseWrapper>
        ),
      },
    ],
  },
]);