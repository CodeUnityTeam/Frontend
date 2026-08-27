import { afterEach, describe, expect, it, vi } from "vitest";

const { apiClient, clearTokens, getRefreshToken, setTokens } = vi.hoisted(() => ({
  apiClient: {
    delete: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
  clearTokens: vi.fn(),
  getRefreshToken: vi.fn(),
  setTokens: vi.fn(),
}));

vi.mock("./api-client", () => ({ apiClient }));
vi.mock("./index", () => ({ apiClient }));
vi.mock("@/shared/api", () => ({ apiClient }));
vi.mock("@/shared/lib/auth", () => ({ clearTokens, getRefreshToken, setTokens }));

import { ApiError, toApiError } from "./api-error";
import { getDocumentBySlug, getDocuments } from "./documents";
import { buildOnboardingPrefill, needsOnboarding, uploadCurrentUserAvatar } from "./profile";
import { applyToProject } from "./projects";
import { createReview, deleteReview, getReviews, updateReview } from "./reviews";
import { fetchSkillCatalog } from "./skills";
import { uploadMultipartFile } from "./upload";
import { getProviderUrl, logout, refreshToken } from "./auth";

afterEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
});

describe("shared API helpers", () => {
  it("maps API and non-API errors to stable domain errors", () => {
    // Init
    const response = { status: 400, data: { email: ["Already in use"] } };

    // Action
    const mapped = toApiError({ isAxiosError: true, response });
    const fallback = toApiError(new Error("network"));

    // Assert
    expect(mapped).toMatchObject({ name: "ApiError", message: "Already in use", status: 400, data: response.data });
    expect(fallback).toBeInstanceOf(ApiError);
    expect(fallback.message).toBe("Не удалось выполнить запрос. Попробуйте позже.");
  });

  it("gets documents and finds a document by slug", async () => {
    // Init
    const documents = [{ slug: "terms", title: "Terms", file_url: "/terms.pdf" }];
    apiClient.get.mockResolvedValueOnce({ data: documents });

    // Action
    const result = await getDocuments();

    // Assert
    expect(apiClient.get).toHaveBeenCalledWith("/documents/");
    expect(result).toEqual(documents);
    expect(getDocumentBySlug(documents, "terms")).toEqual(documents[0]);
    expect(getDocumentBySlug(documents, "missing")).toBeUndefined();
  });

  it("builds profile data, detects incomplete onboarding, and extracts avatar URLs", async () => {
    // Init
    const profile = { first_name: "Ada", last_name: "Lovelace", email: "ada@example.com", avatar_url: "/ada.png" };
    apiClient.post.mockResolvedValueOnce({ data: { avatar_url: "/uploaded.png" } });

    // Action
    const avatarUrl = await uploadCurrentUserAvatar(new File(["image"], "avatar.png"));

    // Assert
    expect(buildOnboardingPrefill(profile)).toEqual({ name: "Ada", surname: "Lovelace", email: "ada@example.com", avatarUrl: "/ada.png" });
    expect(needsOnboarding({ country: " ", city: "Yerevan", soft_skills: "Teamwork", about_me: "About", skills: [{ skill_id: "s", name: "Skill" }], specializations: [{ spec_id: "sp", name: "Spec" }], workformats: [{ format_id: "f", name: "Remote" }], experiences: [{ pk: "e", company: "Co", position: "Dev", responsibilities: "Code", start_date: "2025-01-01", end_date: null }] })).toBe(true);
    expect(avatarUrl).toBe("/uploaded.png");
    expect(apiClient.post).toHaveBeenCalledWith("/user/profile/me/avatar/", expect.any(FormData), expect.objectContaining({ headers: { "Content-Type": "multipart/form-data" } }));
  });

  it("delegates project, review, and multipart requests to their endpoints", async () => {
    // Init
    apiClient.post.mockResolvedValueOnce({ data: { response_id: "r" } }).mockResolvedValueOnce({ data: { review_id: "1" } }).mockResolvedValueOnce({ data: { url: "/file" } });
    apiClient.get.mockResolvedValueOnce({ data: [] });
    apiClient.patch.mockResolvedValueOnce({ data: { review_id: "1", text: "Updated" } });

    // Action
    await applyToProject("project-1");
    await getReviews();
    await createReview("New");
    await updateReview("1", "Updated");
    await deleteReview("1");
    await uploadMultipartFile("/upload/", new File(["x"], "file.txt"), { fieldName: "attachment", headers: { "X-Upload": "yes" } });

    // Assert
    expect(apiClient.post).toHaveBeenNthCalledWith(1, "/projects/project-1/responses/");
    expect(apiClient.get).toHaveBeenCalledWith("/reviews/");
    expect(apiClient.post).toHaveBeenNthCalledWith(2, "/reviews/", { text: "New" });
    expect(apiClient.patch).toHaveBeenCalledWith("/reviews/1/", { text: "Updated" });
    expect(apiClient.delete).toHaveBeenCalledWith("/reviews/1/");
    expect(apiClient.post).toHaveBeenLastCalledWith("/upload/", expect.any(FormData), { headers: { "Content-Type": "multipart/form-data", "X-Upload": "yes" } });
  });

  it("normalizes, caches, and retries skill catalog requests after failure", async () => {
    // Init
    apiClient.get.mockResolvedValueOnce({ data: { results: [{ skill_id: "1", name: "React" }, { id: "2", name: "TypeScript" }, { id: 3, name: "Ignored" }] } });

    // Action
    const first = await fetchSkillCatalog();
    const second = await fetchSkillCatalog();

    // Assert
    expect(first).toEqual([{ id: "1", name: "React" }, { id: "2", name: "TypeScript" }]);
    expect(second).toBe(first);
    expect(apiClient.get).toHaveBeenCalledOnce();
  });

  it("handles provider URLs, logout cleanup, and token refresh persistence", async () => {
    // Init
    apiClient.get.mockResolvedValueOnce({ data: {} });
    getRefreshToken.mockReturnValueOnce("refresh").mockReturnValueOnce("refresh-2");
    apiClient.post.mockResolvedValueOnce({ data: undefined }).mockResolvedValueOnce({ data: { access: "access", refresh: "next-refresh" } });

    // Action
    const providerUrl = await getProviderUrl("yandex");
    await logout();
    const refreshed = await refreshToken();

    // Assert
    expect(providerUrl).toBeNull();
    expect(apiClient.post).toHaveBeenNthCalledWith(1, "/auth/logout/", { refresh: "refresh" });
    expect(clearTokens).toHaveBeenCalledOnce();
    expect(refreshed).toEqual({ access: "access" });
    expect(setTokens).toHaveBeenCalledWith({ access: "access", refresh: "next-refresh" });
  });
});
