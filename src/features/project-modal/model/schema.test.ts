import { describe, expect, it } from "vitest";

import { projectSchema } from "./schema";

const validProject = {
  title: "Platform redesign",
  shortDesc: "A detailed description for a collaborative project.",
  location: "Yerevan",
  startDate: "2026-04-10",
  endDate: "2026-04-20",
  specializations: ["Designer"],
  skills: ["Figma"],
  formatId: "remote",
};

describe("projectSchema", () => {
  it("accepts a complete project form", () => {
    expect(projectSchema.safeParse(validProject).success).toBe(true);
  });

  it("reports the required catalog and format selections", () => {
    const result = projectSchema.safeParse({
      ...validProject,
      specializations: [],
      skills: [],
      formatId: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors).toMatchObject({
        specializations: ["Добавьте хотя бы одну позицию"],
        skills: ["Добавьте хотя бы один тег"],
        formatId: ["Выберите формат"],
      });
    }
  });

  it("rejects an end date before the start date", () => {
    const result = projectSchema.safeParse({
      ...validProject,
      startDate: "2026-04-20",
      endDate: "2026-04-10",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.endDate).toContain(
        "Дата окончания не может быть раньше даты начала",
      );
    }
  });
});
