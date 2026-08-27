import { describe, expect, it } from "vitest";

import { changeEmailSchema } from "./change-email-schema";

describe("changeEmailSchema", () => {
  it("accepts a valid email address", () => {
    expect(
      changeEmailSchema.safeParse({ newEmail: "new.email@example.com" }),
    ).toMatchObject({ success: true });
  });

  it("requires an email address", () => {
    const result = changeEmailSchema.safeParse({ newEmail: "" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Введите email");
    }
  });

  it("rejects an incorrectly formatted email address", () => {
    const result = changeEmailSchema.safeParse({ newEmail: "not-an-email" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "Введите корректный email адрес",
      );
    }
  });
});
