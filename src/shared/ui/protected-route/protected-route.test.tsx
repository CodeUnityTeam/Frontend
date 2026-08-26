import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  openModal: vi.fn(),
  setRedirectPath: vi.fn(),
  useIsAuthed: vi.fn(),
  useLocation: vi.fn(),
}));

vi.mock("react-router", () => ({ useLocation: mocks.useLocation }));
vi.mock("@/shared/lib/auth/use-is-authed", () => ({
  useIsAuthed: mocks.useIsAuthed,
}));
vi.mock("@/shared/store/auth-modal-store", () => ({
  useAuthModalStore: () => ({
    openModal: mocks.openModal,
    setRedirectPath: mocks.setRedirectPath,
  }),
}));

import { ProtectedRoute } from "./protected-route";

describe("ProtectedRoute", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders children without opening the authentication modal for authenticated users", () => {
    // Init
    mocks.useIsAuthed.mockReturnValue(true);
    mocks.useLocation.mockReturnValue({ pathname: "/projects", search: "?tab=mine" });

    // Action
    render(
      <ProtectedRoute>
        <p>Private content</p>
      </ProtectedRoute>,
    );

    // Assert
    expect(screen.getByText("Private content")).toBeInTheDocument();
    expect(mocks.setRedirectPath).not.toHaveBeenCalled();
    expect(mocks.openModal).not.toHaveBeenCalled();
  });

  it("hides children and opens authentication with the full current path for guests", () => {
    // Init
    mocks.useIsAuthed.mockReturnValue(false);
    mocks.useLocation.mockReturnValue({ pathname: "/projects/42", search: "?edit=true" });

    // Action
    render(
      <ProtectedRoute>
        <p>Private content</p>
      </ProtectedRoute>,
    );

    // Assert
    expect(screen.queryByText("Private content")).not.toBeInTheDocument();
    expect(mocks.setRedirectPath).toHaveBeenCalledWith("/projects/42?edit=true");
    expect(mocks.openModal).toHaveBeenCalledOnce();
  });
});
