import { Header } from "@/widgets/header";
import { Outlet } from "react-router";
import { Footer } from "@/widgets/footer";
import { Providers } from "./providers";

export function App() {
  return (
    <Providers>
      <div className="app-layout">
        <Header />
        <Outlet />
        <Footer />
      </div>
    </Providers>
  );
}
