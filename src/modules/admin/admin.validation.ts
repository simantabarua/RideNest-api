import { z } from "zod";
import { IsActive, Role } from "../user/user.interface";
import {
  addressSchema,
  emailSchema,
  nameSchema,
  passwordSchema,
  phoneSchema,
} from "../user/user.validation";

const allowedRoles = Object.values(Role).filter(
  (role) => role !== Role.SUPER_ADMIN
);

export const updateUserRoleSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  password: passwordSchema.optional(),
  phone: phoneSchema.optional(),
  address: addressSchema.optional(),
  picture: z.string().optional().or(z.literal("")).optional(),
  role: z.enum([...allowedRoles] as [Role, ...Role[]]).optional(),
  isActive: z.enum(Object.values(IsActive) as [string]).optional(),
  isDeleted: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  isApproved: z.boolean().optional(),
  isSuspend: z.boolean().optional(),
  driverInfo: z.string().optional(),
  riderInfo: z.string().optional(),
});
