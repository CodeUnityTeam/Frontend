import { Icon } from "@iconify/react";
import { Outlet } from "react-router";

export function App() {
  return (
    <div className="app-layout">
      {
        // TODO: Демонстрация использования иконок
        // дока:
        // TLDR: https://www.npmjs.com/package/@iconify/react
        // Official: https://iconify.design/docs/iconify-icon/
        // так же на сайте можно ознакомиться с обильной библиотекой паков иконок.
      }
      <Icon
        icon="ph:eye"
        className="text-7xl text-purple-600 mx-auto h-dvh hover:text-purple-400 cursor-pointer transition"
      />
      {/* тут размещается sidebar */}
      <Outlet />
    </div>
  );
}
