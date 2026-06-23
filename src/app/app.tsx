import { Header } from "@/widgets/header";
import { Outlet } from "react-router";
import { Footer } from "@/widgets/footer";
import { Providers } from "./providers";
import AuthModalManager from "@/widgets/registration/ui/auth-modal-manager";
import { Suspense } from "react";

export function App() {
  return (
    <Providers>
      <AuthModalManager />
      <div className="flex min-h-svh flex-col">
        <Header />
        <main className="flex flex-1 flex-col">
          <Suspense fallback={<div>Загрузка...</div>}>
            <Outlet />
          </Suspense>
        </main>
        <Footer />
      </div>
    </Providers>
  );
}
