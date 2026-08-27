import { afterEach, describe, expect, it, vi } from "vitest";

const apiClient = vi.hoisted(() => ({ delete: vi.fn(), get: vi.fn(), patch: vi.fn(), post: vi.fn(), put: vi.fn() }));

vi.mock("./index", () => ({ apiClient }));

import {
  buildOnboardingPrefill,
  createExperience,
  deleteCurrentUserAvatar,
  deleteExperience,
  getCurrentUserProfile,
  needsOnboarding,
  updateCurrentUserProfile,
  updateExperience,
  uploadCurrentUserAvatar,
} from "./profile";

const completedProfile = {
  country: "Armenia", city: "Yerevan", soft_skills: "Communication", about_me: "Developer",
  skills: [{ skill_id: "1", name: "React" }], specializations: [{ spec_id: "1", name: "Frontend" }],
  workformats: [{ format_id: "1", name: "Remote" }], experiences: [{ pk: "1", company: "KU", position: "Dev", responsibilities: "Code", start_date: "2024-01-01", end_date: null }],
};

describe("profile API", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("reads, maps, and updates the current profile through the profile endpoint", async () => {
    // Init
    const profile = { pk: "1", first_name: "Ada", last_name: "Lovelace", email: "ada@example.com", avatar_url: "/ada.png" };
    const update = { city: "Gyumri" };
    apiClient.get.mockResolvedValue({ data: profile });
    apiClient.patch.mockResolvedValue({ data: { ...profile, ...update } });

    // Action
    const fetched = await getCurrentUserProfile();
    const prefill = buildOnboardingPrefill(profile as never);
    const updated = await updateCurrentUserProfile(update);

    // Assert
    expect(fetched).toEqual(profile);
    expect(prefill).toEqual({ name: "Ada", surname: "Lovelace", email: "ada@example.com", avatarUrl: "/ada.png" });
    expect(updated).toEqual({ ...profile, ...update });
    expect(apiClient.get).toHaveBeenCalledWith("/user/profile/me/");
    expect(apiClient.patch).toHaveBeenCalledWith("/user/profile/me/", update);
  });

  it("requires every onboarding section and treats whitespace-only text as incomplete", () => {
    // Init
    const whitespaceProfile = { ...completedProfile, country: "   " };

    // Action
    const complete = needsOnboarding(completedProfile);
    const incomplete = needsOnboarding(whitespaceProfile);

    // Assert
    expect(complete).toBe(false);
    expect(incomplete).toBe(true);
  });

  it("uses scoped experience and avatar endpoints and only accepts a string avatar URL", async () => {
    // Init
    const payload = { company: "KU", position: "Developer", responsibilities: "Code", start_date: "2024-01-01", end_date: null };
    apiClient.post.mockResolvedValueOnce({ data: { pk: "new" } }).mockResolvedValueOnce({ data: { avatar_url: 42 } });
    apiClient.put.mockResolvedValue({ data: { pk: "experience-1" } });

    // Action
    const created = await createExperience(payload);
    const updated = await updateExperience("experience-1", payload);
    const avatarUrl = await uploadCurrentUserAvatar(new File(["image"], "avatar.png", { type: "image/png" }));
    await deleteExperience("experience-1");
    await deleteCurrentUserAvatar();

    // Assert
    expect(created).toEqual({ pk: "new" });
    expect(updated).toEqual({ pk: "experience-1" });
    expect(avatarUrl).toBe("");
    expect(apiClient.post).toHaveBeenNthCalledWith(1, "/user/profile/me/experience/", payload);
    expect(apiClient.put).toHaveBeenCalledWith("/user/profile/me/experience/experience-1/", payload);
    expect(apiClient.post).toHaveBeenNthCalledWith(2, "/user/profile/me/avatar/", expect.any(FormData), expect.objectContaining({ headers: { "Content-Type": "multipart/form-data" } }));
    expect(apiClient.delete).toHaveBeenCalledWith("/user/profile/me/experience/experience-1/");
    expect(apiClient.delete).toHaveBeenCalledWith("/user/profile/me/avatar/");
  });
});
