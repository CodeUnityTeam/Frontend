import { describe, expect, it } from "vitest";

import { consentRules, emailRules, passwordRules } from "./validation";

describe("login validation rules", () => {
  it("exposes the required email, format, password-length, and consent contracts", () => {
    expect(emailRules.required).toBe("Введите E-mail");
    expect(emailRules.pattern).toMatchObject({ message: "Введите корректный E-mail" });
    expect((emailRules.pattern as { value: RegExp }).value.test("user@example.com")).toBe(true);
    expect((emailRules.pattern as { value: RegExp }).value.test("not-an-email")).toBe(false);
    expect(passwordRules).toMatchObject({ required: "Введите пароль", minLength: { value: 5 } });
    expect(consentRules.required).toBe("Необходимо согласие на обработку данных");
  });
});
