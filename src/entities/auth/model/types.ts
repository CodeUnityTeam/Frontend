/** Данные для входа по E-mail и паролю (тело `POST /user/auth/login/`, схема `CustomLogin`). */
export interface LoginCredentials {
  email: string;
  password: string;
}

/** Пользователь в доменной модели фронта (после маппинга из DTO бэка). */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

/** Результат входа в доменной модели: пара токенов + пользователь. */
export interface AuthSession {
  access: string;
  refresh: string;
  user: AuthUser;
}

// --- DTO бэкенда (OpenAPI-схема CodeUnity) ---------------------------------

/** Схема `CustomUserDetails` (поля, нужные фронту; остальные игнорируем). */
export interface UserDetailsDto {
  pk: string;
  email: string;
  first_name: string;
  last_name: string;
}

/** Схема `JWT` — ответ `POST /user/auth/login/`. */
export interface LoginResponseDto {
  access: string;
  refresh: string;
  user: UserDetailsDto;
}

/** Маппер DTO → домен: `pk`→`id`, имя собираем из `first_name`+`last_name`. */
export function mapUserDetails(dto: UserDetailsDto): AuthUser {
  return {
    id: dto.pk,
    name: [dto.first_name, dto.last_name].filter(Boolean).join(" "),
    email: dto.email,
  };
}
