import { describe, expect, it } from "vitest";

import { changePasswordSchema } from "./change-password-schema";

describe("changePasswordSchema", () => {
  it("accepts distinct space-free passwords of at least eight characters", () => {
    expect(changePasswordSchema.safeParse({ old_password: "current1", new_password: "updated1" }).success).toBe(true);
  });

  it("rejects blank, whitespace-containing, short, and unchanged passwords", () => {
    expect(changePasswordSchema.safeParse({ old_password: "", new_password: "updated1" }).error?.issues[0]?.message).toBe("Введите текущий пароль");
    expect(changePasswordSchema.safeParse({ old_password: "current1", new_password: "with space" }).error?.issues[0]?.message).toBe("Пароль не должен содержать пробелы");
    expect(changePasswordSchema.safeParse({ old_password: "current1", new_password: "short" }).error?.issues[0]?.message).toBe("Пароль должен содержать минимум 8 символов");
    expect(changePasswordSchema.safeParse({ old_password: "current1", new_password: "current1" }).error?.issues[0]?.message).toBe("Новый пароль не должен совпадать с текущим");
  });
});
