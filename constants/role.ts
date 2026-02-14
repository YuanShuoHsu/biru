export enum RoleEnum {
  Admin = "admin",
  Manager = "manager",
  Staff = "staff",
  User = "user",
}

export const roles = [
  RoleEnum.Admin,
  RoleEnum.Manager,
  RoleEnum.Staff,
  RoleEnum.User,
] as const;

export const defaultRole = RoleEnum.User;
