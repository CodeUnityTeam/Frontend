export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthSession {
  access: string;
  refresh: string;
  user: AuthUser;
}

export interface UserDetailsDto {
  pk: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface LoginResponseDto {
  access: string;
  refresh: string;
  user: UserDetailsDto;
}

export function mapUserDetails(dto: UserDetailsDto): AuthUser {
  return {
    id: dto.pk,
    name: [dto.first_name, dto.last_name].filter(Boolean).join(" "),
    email: dto.email,
  };
}
