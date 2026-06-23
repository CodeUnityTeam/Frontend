import { Header } from "@/widgets/header";
import { Outlet } from "react-router";
import { Footer } from "@/widgets/footer";
import { Providers } from "./providers";
import AuthModalManager from "@/widgets/registration/ui/auth-modal-manager";

export function App() {
  return (
    <Providers>
      <AuthModalManager />
      <div className="flex min-h-svh flex-col">
        <Header />
        <main className="flex flex-1 flex-col">
          <Outlet />
          </main>
        <Footer />
      </div>
    </Providers>
  );
}
