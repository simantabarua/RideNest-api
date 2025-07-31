import { z } from "zod";
import { IsActive, Role } from "../user/user.interface";

const allowedRoles = Object.values(Role).filter(
  (role) => role !== Role.SUPER_ADMIN
);

export const updateUserRoleSchema = z.object({
  body: z.object({
    role: z.enum([...allowedRoles] as [Role, ...Role[]]).optional(),
    isActive: z.enum(Object.values(IsActive) as [string]).optional(),
  }),
});
