import type { RegisterOptions } from "react-hook-form";
import type { EditProfileFormData } from "./types";

export const firstNameRules: RegisterOptions<EditProfileFormData, "firstName"> =
  {
    required: "Введите имя",
    minLength: {
      value: 2,
      message: "Имя должно содержать минимум 2 символа",
    },
  };

export const lastNameRules: RegisterOptions<EditProfileFormData, "lastName"> = {
  required: "Введите фамилию",
  minLength: {
    value: 2,
    message: "Фамилия должна содержать минимум 2 символа",
  },
};

export const countryRules: RegisterOptions<EditProfileFormData, "country"> = {
  required: "Введите страну",
};

export const cityRules: RegisterOptions<EditProfileFormData, "city"> = {
  required: "Введите город",
};

export const roleRules: RegisterOptions<EditProfileFormData, "role"> = {
  required: "Выберите роль",
};

export const formatRules: RegisterOptions<EditProfileFormData, "format"> = {
  required: "Выберите формат работы",
};