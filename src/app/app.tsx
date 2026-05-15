import { Header } from "@/widgets/header";
import { Outlet } from "react-router";

export function App() {
  return (
    <div className="app-layout">
      {/* тут размещается sidebar */}
      <Header />
      <Outlet />
    </div>
  );
}
