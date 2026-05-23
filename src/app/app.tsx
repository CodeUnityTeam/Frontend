import { Outlet } from "react-router";
import { Footer } from "@/widgets/footer";

export function App() {
  return (
    <div className="app-layout">
      {/* тут размещается sidebar */}
      <Outlet />
      <Footer />
    </div>
  );
}
