import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useFormats, useSpecializations } from "@/entities/reference";
import { useSkills } from "@/entities/skill";
import { useCreateProject, useUpdateProject } from "@/entities/project";
import { ProjectModal } from "./project-modal";
import { renderWithProviders } from "@/test/render-with-providers";

const createMutate = vi.fn();
const updateMutate = vi.fn();

vi.mock("@iconify/react", () => ({ Icon: () => null }));
vi.mock("@/entities/reference", () => ({
  useFormats: vi.fn(),
  useSpecializations: vi.fn(),
}));
vi.mock("@/entities/skill", () => ({ useSkills: vi.fn() }));
vi.mock("@/entities/project", () => ({
  useCreateProject: vi.fn(),
  useUpdateProject: vi.fn(),
}));
vi.mock("@/shared/ui/modal/modal", () => ({
  Modal: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <div>{children}</div> : null,
  ModalHeader: ({ children }: { children: React.ReactNode }) => <header>{children}</header>,
  ModalTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
  ModalDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  ModalBody: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ModalFooter: ({ children }: { children: React.ReactNode }) => <footer>{children}</footer>,
}));
vi.mock("@/shared/ui/modal/alert-modal", () => ({
  AlertModal: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <div>{children}</div> : null,
  AlertModalHeader: ({ children }: { children: React.ReactNode }) => <header>{children}</header>,
  AlertModalTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
  AlertModalDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  AlertModalFooter: ({ children }: { children: React.ReactNode }) => <footer>{children}</footer>,
  AlertModalAction: ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => <button onClick={onClick}>{children}</button>,
  AlertModalCancel: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
}));
vi.mock("@/shared/ui/tag-input", () => ({
  TagInput: ({ label, value, onChange, error }: { label: string; value: string[]; onChange: (value: string[]) => void; error?: string }) => (
    <label>
      {label}
      <input aria-label={label} value={value.join(",")} onChange={(event) => onChange(event.target.value ? event.target.value.split(",") : [])} />
      {error && <span>{error}</span>}
    </label>
  ),
}));

const fillRequiredFields = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByPlaceholderText("Введите текст"), "Platform redesign");
  await user.type(screen.getByPlaceholderText("Начните писать..."), "A detailed description for a collaborative project.");
  await user.type(screen.getByPlaceholderText("Укажите город"), "Yerevan");
  const dates = screen.getAllByDisplayValue("");
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(dates[0], "2027-04-10");
  fireEvent.input(dates[0], { target: { value: "2027-04-10" } });
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(dates[1], "2027-04-20");
  fireEvent.input(dates[1], { target: { value: "2027-04-20" } });
  await user.type(screen.getByLabelText("Позиция"), "Designer");
  await user.type(screen.getByLabelText("Теги"), "Figma");
  await user.click(screen.getByLabelText("Remote"));
};

describe("ProjectModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useFormats).mockReturnValue({ data: [{ id: "remote", name: "Remote" }] } as ReturnType<typeof useFormats>);
    vi.mocked(useSpecializations).mockReturnValue({ data: [{ id: "spec-1", name: "Designer" }] } as ReturnType<typeof useSpecializations>);
    vi.mocked(useSkills).mockReturnValue({ data: [{ skillId: "skill-1", name: "Figma" }] } as ReturnType<typeof useSkills>);
    vi.mocked(useCreateProject).mockReturnValue({ mutate: createMutate, isPending: false } as unknown as ReturnType<typeof useCreateProject>);
    vi.mocked(useUpdateProject).mockReturnValue({ mutate: updateMutate, isPending: false } as unknown as ReturnType<typeof useUpdateProject>);
  });

  it("maps create form values to the create payload and closes after success", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderWithProviders(<ProjectModal open onOpenChange={onOpenChange} mode="create" />);

    // Form submission
    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: "Опубликовать" }));

    expect(createMutate).toHaveBeenCalledWith({
      title: "Platform redesign",
      short_desc: "A detailed description for a collaborative project.",
      location: "Yerevan",
      start_date: "2027-04-10",
      end_date: "2027-04-20",
      project_format: ["remote"],
      specializations: [{ spec_id: "spec-1" }],
      skills: [{ skill_id: "skill-1" }],
      status_project: "published",
    }, expect.any(Object));

    // Success callback effects
    createMutate.mock.calls[0]?.[1]?.onSuccess?.();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("loads a published project, preserves its start date, and maps update values", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProjectModal open onOpenChange={vi.fn()} mode="edit" project={{
      project_id: "project-1", title: "Existing project", short_desc: "Existing detailed project description.", location: "Yerevan", start_date: "2027-04-10T00:00:00Z", end_date: "2027-04-20T00:00:00Z", status_project: "published", skills: [{ skill_id: "skill-1", name: "Figma" }], specializations: [{ spec_id: "spec-1", name: "Designer" }], project_format: [{ format_id: "remote", name: "Remote" }], full_desc: "", published_at: "", participants_count: 0, is_liked_by_me: false, is_favorite_by_me: false, likes_count: 0, author: { user_id: "author" }, participants: [],
    }} />);

    // Published-project state and edit submission
    const [startDate, endDate] = screen.getAllByDisplayValue(/2027-04-(10|20)/);
    expect(startDate).toHaveValue("2027-04-10");
    expect(screen.getByText("Дату начала нельзя изменить после публикации")).toBeInTheDocument();
    fireEvent.change(endDate, { target: { value: "2027-04-30" } });
    await user.click(screen.getByRole("button", { name: "Сохранить" }));

    expect(updateMutate).toHaveBeenCalledWith({ projectId: "project-1", dto: expect.objectContaining({ end_date: "2027-04-30", project_format: ["remote"], specializations: [{ spec_id: "spec-1" }], skills: [{ skill_id: "skill-1" }] }) }, expect.any(Object));
    expect(updateMutate.mock.calls[0]?.[0].dto).not.toHaveProperty("start_date");
  });

  it("shows catalog validation and confirms discarding dirty changes", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderWithProviders(<ProjectModal open onOpenChange={onOpenChange} mode="create" />);

    // Invalid catalog submission
    await fillRequiredFields(user);
    await user.clear(screen.getByLabelText("Теги"));
    await user.type(screen.getByLabelText("Теги"), "Unknown");
    await user.click(screen.getByRole("button", { name: "Опубликовать" }));
    expect(await screen.findByText("Выберите теги из списка: Unknown")).toBeInTheDocument();
    expect(createMutate).not.toHaveBeenCalled();

    // Dirty-form discard confirmation
    await user.click(screen.getByRole("button", { name: "Отменить" }));
    expect(screen.getByRole("heading", { name: "Закрыть форму?" })).toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Закрыть" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
