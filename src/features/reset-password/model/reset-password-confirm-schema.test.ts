import { describe, expect, it } from "vitest";

import { resetPasswordConfirmSchema } from "./reset-password-confirm-schema";

describe("resetPasswordConfirmSchema", () => {
  it("accepts matching space-free passwords", () => {
    expect(resetPasswordConfirmSchema.safeParse({ new_password: "password1", new_password_confirm: "password1" }).success).toBe(true);
  });

  it("rejects missing, whitespace-containing, and mismatched passwords", () => {
    expect(resetPasswordConfirmSchema.safeParse({ new_password: "", new_password_confirm: "" }).error?.issues[0]?.message).toBe("Введите новый пароль");
    expect(resetPasswordConfirmSchema.safeParse({ new_password: "bad password", new_password_confirm: "bad password" }).error?.issues[0]?.message).toBe("Пароль не должен содержать пробелы");
    expect(resetPasswordConfirmSchema.safeParse({ new_password: "password1", new_password_confirm: "password2" }).error?.issues[0]?.message).toBe("Пароли должны совпадать");
  });
});
