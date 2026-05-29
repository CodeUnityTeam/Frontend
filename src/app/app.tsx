import { Header } from "@/widgets/header";
import { Outlet } from "react-router";
import { Footer } from "@/widgets/footer";

export function App() {
  return (
    <div className="app-layout">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
