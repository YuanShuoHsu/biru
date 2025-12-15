import type { Role } from "./role";

export interface UserResponseDto {
  id: string;
  countryCode: string;
  createdAt: string;
  email: string;
  emailVerified: boolean;
  firstName: string;
  image: string;
  lastName: string;
  phone: string | null;
  phoneVerified: boolean;
  role: Role;
  updatedAt: string;
}
