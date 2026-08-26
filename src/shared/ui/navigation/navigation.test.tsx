import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

import { Navigation } from "./navigation";

describe("Navigation", () => {
  it("renders accessible links, marks the current route, and delegates item clicks", async () => {
    // Init
    const user = userEvent.setup();
    const onItemClick = vi.fn();
    render(
      <MemoryRouter initialEntries={["/projects"]}>
        <Navigation
          items={[
            { id: "/projects", to: "/projects", label: "Projects" },
            { id: "/profile", to: "/profile", label: "Profile" },
          ]}
          className="navigation"
          listClassName="navigation-list"
          itemClassName="navigation-item"
          activeLinkClassName="is-active"
          onItemClick={onItemClick}
        />
      </MemoryRouter>,
    );

    // Assert
    expect(screen.getByRole("navigation")).toHaveClass("navigation");
    expect(screen.getByRole("list")).toHaveClass("navigation-list");
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getAllByRole("listitem")[0]).toHaveClass("navigation-item");
    expect(screen.getByRole("link", { name: "Перейти на страницу Projects" })).toHaveClass(
      "is-active",
    );

    // Action
    await user.click(screen.getByRole("link", { name: "Перейти на страницу Profile" }));

    // Assert
    expect(onItemClick).toHaveBeenCalledOnce();
  });
});
