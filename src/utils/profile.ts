import type { UserResponseDto } from "@/types/users/user-response.dto";

export const getDisplayName = (profile: UserResponseDto | null) => {
  if (!profile) return "";

  const name = [profile.firstName, profile.lastName].filter(Boolean).join(" ");

  return name || profile.email || "";
};
