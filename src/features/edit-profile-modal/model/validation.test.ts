import { describe, expect, it } from "vitest";

import {
  cityRules,
  countryRules,
  firstNameRules,
  formatRules,
  lastNameRules,
  roleRules,
} from "./validation";

describe("edit profile validation rules", () => {
  it("requires the identity, location, role, and work-format fields", () => {
    expect(firstNameRules.required).toBe("Введите имя");
    expect(lastNameRules.required).toBe("Введите фамилию");
    expect(countryRules.required).toBe("Введите страну");
    expect(cityRules.required).toBe("Введите город");
    expect(roleRules.required).toBe("Выберите роль");
    expect(formatRules.required).toBe("Выберите формат работы");
  });

  it("enforces a two-character minimum for first and last names", () => {
    expect(firstNameRules.minLength).toEqual({
      value: 2,
      message: "Имя должно содержать минимум 2 символа",
    });
    expect(lastNameRules.minLength).toEqual({
      value: 2,
      message: "Фамилия должна содержать минимум 2 символа",
    });
  });
});
