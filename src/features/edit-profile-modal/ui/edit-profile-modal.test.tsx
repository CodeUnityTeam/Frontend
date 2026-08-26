import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps, PropsWithChildren } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useCurrentProfile, useUpdateProfile } from "@/entities/profile";
import { renderWithProviders } from "@/test/render-with-providers";
import { EditProfileModal } from "./edit-profile-modal";

const mutate = vi.fn();
const { toastSuccess } = vi.hoisted(() => ({ toastSuccess: vi.fn() }));

const profile = {
  first_name: "Ada",
  last_name: "Lovelace",
  projects_relation: "employer",
  phone_number: "+37400000000",
  additional_contact: "@ada",
  country: "Armenia",
  city: "Yerevan",
  soft_skills: "Communication",
  about_me: "Engineer",
  skills: [{ skill_id: "skill-1", name: "TypeScript" }],
  specializations: [{ spec_id: "spec-1", name: "Development" }],
  workformats: [{ format_id: "hybrid", name: "Hybrid" }],
  experiences: [{ position: "Mathematician" }],
};

vi.mock("@/entities/profile", () => ({
  useCurrentProfile: vi.fn(),
  useUpdateProfile: vi.fn(),
}));
vi.mock("sonner", () => ({ toast: { success: toastSuccess } }));
vi.mock("@/shared/ui/modal/modal", () => ({
  Modal: ({ children, open }: React.PropsWithChildren<{ open: boolean }>) => open ? <div>{children}</div> : null,
}));
vi.mock("@/shared/ui/dialog", () => ({
  DialogClose: ({ children, ...props }: React.ComponentProps<"button">) => <button {...props}>{children}</button>,
}));
vi.mock("@/shared/ui/icon", () => ({ Icon: () => null }));
vi.mock("@/shared/ui/radio-group", () => ({
  RadioGroup: ({ children }: PropsWithChildren) => <div>{children}</div>,
  RadioGroupItem: ({ value, id, ...props }: ComponentProps<"input">) => <input {...props} id={id} type="radio" value={value} />,
}));

describe("EditProfileModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useCurrentProfile).mockReturnValue({ data: profile, isLoading: false } as ReturnType<typeof useCurrentProfile>);
    vi.mocked(useUpdateProfile).mockReturnValue({ mutate, isPending: false } as unknown as ReturnType<typeof useUpdateProfile>);
  });

  it("prefills the profile, maps edits to the update payload, and closes only after success", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderWithProviders(<EditProfileModal open onOpenChange={onOpenChange} />);

    // Initial profile values
    await waitFor(() => expect(screen.getByLabelText("Имя")).toHaveValue("Ada"));
    expect(screen.getByLabelText("Занимаемая должность")).toHaveValue("Mathematician");

    // Edit and submit the profile
    await user.clear(screen.getByLabelText("Город"));
    await user.type(screen.getByLabelText("Город"), "Gyumri");
    await user.click(screen.getByRole("button", { name: "Сохранить" }));

    expect(mutate).toHaveBeenCalledWith({
      first_name: "Ada",
      last_name: "Lovelace",
      projects_relation: "employer",
      phone_number: "+37400000000",
      additional_contact: "@ada",
      country: "Armenia",
      city: "Gyumri",
      soft_skills: "Communication",
      about_me: "Engineer",
      skills: ["skill-1"],
      specializations: ["spec-1"],
      workformats: ["hybrid"],
    }, expect.any(Object));
    expect(onOpenChange).not.toHaveBeenCalled();

    // Success callback effects
    mutate.mock.calls[0]?.[1]?.onSuccess?.();
    expect(toastSuccess).toHaveBeenCalledWith("Профиль обновлён");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("does not render before the profile query has completed", () => {
    vi.mocked(useCurrentProfile).mockReturnValue({ data: undefined, isLoading: true } as ReturnType<typeof useCurrentProfile>);

    renderWithProviders(<EditProfileModal open onOpenChange={vi.fn()} />);

    expect(screen.queryByRole("button", { name: "Сохранить" })).not.toBeInTheDocument();
  });

  it("prevents resubmission while the update is pending", () => {
    vi.mocked(useUpdateProfile).mockReturnValue({ mutate, isPending: true } as unknown as ReturnType<typeof useUpdateProfile>);

    renderWithProviders(<EditProfileModal open onOpenChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Сохранение..." })).toBeDisabled();
  });
});
