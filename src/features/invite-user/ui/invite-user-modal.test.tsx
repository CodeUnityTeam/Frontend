import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useInviteUser, useProjects } from "@/entities/project";
import { renderWithProviders } from "@/test/render-with-providers";
import { InviteUserModal } from "./invite-user-modal";

const invite = vi.fn();
const refetch = vi.fn();

vi.mock("@/entities/project", () => ({
  useInviteUser: vi.fn(),
  useProjects: vi.fn(),
}));
vi.mock("@/shared/ui/modal/modal", () => ({
  Modal: ({ children, open }: { children: React.ReactNode; open: boolean }) => open ? <div>{children}</div> : null,
  ModalHeader: ({ children }: { children: React.ReactNode }) => <header>{children}</header>,
  ModalTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
  ModalBody: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ModalFooter: ({ children }: { children: React.ReactNode }) => <footer>{children}</footer>,
}));
vi.mock("@/shared/ui/radio-group", () => ({
  RadioGroup: ({ children, value, onValueChange }: { children: React.ReactNode; value: string; onValueChange: (value: string) => void }) => <div data-value={value} onChange={(event) => onValueChange((event.target as HTMLInputElement).value)}>{children}</div>,
  RadioGroupItem: ({ value }: { value: string }) => <input type="radio" value={value} aria-label={value} />,
}));

describe("InviteUserModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useInviteUser).mockReturnValue({ mutate: invite, isPending: false } as unknown as ReturnType<typeof useInviteUser>);
    vi.mocked(useProjects).mockReturnValue({ data: undefined, isPending: false, isError: false, refetch } as unknown as ReturnType<typeof useProjects>);
  });

  it("queries published owned projects only while open and submits the selected project", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    vi.mocked(useProjects).mockReturnValue({ data: { pages: [{ items: [{ projectId: "project-1", title: "Design system", shortDesc: "Reusable UI" }] }] }, isPending: false, isError: false, refetch } as unknown as ReturnType<typeof useProjects>);
    renderWithProviders(<InviteUserModal open onOpenChange={onOpenChange} userId="user-1" />);

    // Available-project assertion and invitation submission
    expect(useProjects).toHaveBeenCalledWith({ myProject: true, status: ["published"], pageSize: 100 }, { enabled: true });
    expect(screen.getByText("Design system")).toBeInTheDocument();
    await user.click(screen.getByLabelText("project-1"));
    await user.click(screen.getByRole("button", { name: "Пригласить" }));

    expect(invite).toHaveBeenCalledWith({ projectId: "project-1", userId: "user-1" }, expect.any(Object));

    // Success callback effects
    invite.mock.calls[0]?.[1]?.onSuccess?.();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("renders loading, error retry, and empty guards without enabling invitation", async () => {
    const user = userEvent.setup();
    const { rerender } = renderWithProviders(<InviteUserModal open onOpenChange={vi.fn()} userId="user-1" />);

    // Loading-state guard
    vi.mocked(useProjects).mockReturnValue({ data: undefined, isPending: true, isError: false, refetch } as unknown as ReturnType<typeof useProjects>);
    rerender(<InviteUserModal open onOpenChange={vi.fn()} userId="user-1" />);
    expect(screen.getByText("Загрузка проектов...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Пригласить" })).toBeDisabled();

    // Error-state retry
    vi.mocked(useProjects).mockReturnValue({ data: undefined, isPending: false, isError: true, refetch } as unknown as ReturnType<typeof useProjects>);
    rerender(<InviteUserModal open onOpenChange={vi.fn()} userId="user-1" />);
    await user.click(screen.getByRole("button", { name: "Повторить" }));
    expect(refetch).toHaveBeenCalledOnce();

    // Empty-state guard
    vi.mocked(useProjects).mockReturnValue({ data: { pages: [{ items: [] }] }, isPending: false, isError: false, refetch } as unknown as ReturnType<typeof useProjects>);
    rerender(<InviteUserModal open onOpenChange={vi.fn()} userId="user-1" />);
    expect(screen.getByText("Нет опубликованных проектов.")).toBeInTheDocument();
    expect(invite).not.toHaveBeenCalled();
  });
});
