import { afterEach, describe, expect, it, vi } from "vitest";

const apiClient = vi.hoisted(() => ({ get: vi.fn() }));

vi.mock("./index", () => ({ apiClient }));

async function loadSkillsApi() {
  // Module cache reset gives every test an independent catalog singleton.
  vi.resetModules();
  return import("./skills");
}

describe("fetchSkillCatalog", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("normalizes supported array response shapes and ignores malformed entries", async () => {
    // Init
    const { fetchSkillCatalog } = await loadSkillsApi();
    apiClient.get.mockResolvedValue({ data: [{ skill_id: "react", name: "React" }, { id: "ts", name: "TypeScript" }, { id: 3, name: "Ignored" }, null] });

    // Action
    const catalog = await fetchSkillCatalog();

    // Assert
    expect(catalog).toEqual([{ id: "react", name: "React" }, { id: "ts", name: "TypeScript" }]);
    expect(apiClient.get).toHaveBeenCalledWith("/qna/tags/");
  });

  it("shares the in-flight request and retains the successful catalog", async () => {
    // Init
    const { fetchSkillCatalog } = await loadSkillsApi();
    let resolveRequest!: (value: { data: unknown }) => void;
    apiClient.get.mockReturnValue(new Promise((resolve) => { resolveRequest = resolve; }));

    // Action
    const first = fetchSkillCatalog();
    const second = fetchSkillCatalog();
    resolveRequest({ data: { results: [{ id: "react", name: "React" }] } });
    const [firstCatalog, secondCatalog] = await Promise.all([first, second]);
    const thirdCatalog = await fetchSkillCatalog();

    // Assert
    expect(firstCatalog).toEqual([{ id: "react", name: "React" }]);
    expect(secondCatalog).toBe(firstCatalog);
    expect(thirdCatalog).toBe(firstCatalog);
    expect(apiClient.get).toHaveBeenCalledOnce();
  });

  it("clears a rejected singleton so a later caller can retry", async () => {
    // Init
    const { fetchSkillCatalog } = await loadSkillsApi();
    apiClient.get.mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce({ data: { results: [] } });

    // Action
    await expect(fetchSkillCatalog()).rejects.toThrow("offline");
    const catalog = await fetchSkillCatalog();

    // Assert
    expect(catalog).toEqual([]);
    expect(apiClient.get).toHaveBeenCalledTimes(2);
  });
});
