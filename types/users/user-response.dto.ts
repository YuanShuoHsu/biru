import type { Role } from "./role";

export interface UserResponseDto {
  id: string;
  birthDate: string;
  countryCode: string;
  createdAt: string;
  email: string;
  emailVerified: boolean;
  firstName: string;
  gender: string;
  image: string;
  isSubscribed: boolean;
  lastName: string;
  phone: string | null;
  phoneVerified: boolean;
  role: Role;
  updatedAt: string;
}
