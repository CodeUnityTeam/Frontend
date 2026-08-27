import { describe, expect, it } from "vitest";

import { navigationConfigs } from "./navigation-config";

describe("navigation configuration", () => {
  it("provides the complete footer navigation and a focused header subset", () => {
    // Init
    const footerIds = navigationConfigs.footer.map(({ id }) => id);
    const headerIds = navigationConfigs.header.map(({ id }) => id);

    // Action
    const footerRoutes = navigationConfigs.footer.map(({ to }) => to);
    const headerRoutes = navigationConfigs.header.map(({ to }) => to);

    // Assert
    expect(footerIds).toEqual(["projects", "qa", "about", "help", "documents"]);
    expect(footerRoutes).toEqual(["/projects", "/qa", "/about", "/help", "/documents"]);
    expect(headerIds).toEqual(["projects", "qa", "about"]);
    expect(headerRoutes).toEqual(["/projects", "/qa", "/about"]);
  });
});
