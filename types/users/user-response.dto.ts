import type { Role } from "./role";

export interface UserResponseDto {
  id: string;
  birthDate: string | null;
  countryCode: string;
  countryLabel: string;
  countryPhone: string;
  createdAt: string;
  email: string;
  emailVerified: boolean;
  emailVerifiedAt: string | null;
  firstName: string;
  gender: string;
  image: string | null;
  isSubscribed: boolean;
  lastName: string;
  phoneNumber: string | null;
  phoneVerified: boolean;
  role: Role;
  updatedAt: string;
}
