import { Header } from "@/widgets/header";
import { ValueProps } from "@/widgets/value-props";
import { Outlet } from "react-router";

export function App() {
  return (
    <div className="app-layout">
      {/* тут размещается sidebar */}
      <Header />
      <ValueProps/>
      <Outlet />
    </div>
  );
}
