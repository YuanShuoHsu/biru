import type { Role } from "./role";

export interface UserResponseDto {
  id: string;
  birthDate: string | null;
  createdAt: string;
  email: string;
  emailSubscribed: boolean;
  emailVerified: boolean;
  firstName: string;
  gender: string;
  image: string | null;
  lastName: string;
  phoneNumber: string | null;
  phoneNumberVerified: boolean;
  role: Role;
  updatedAt: string;
}
