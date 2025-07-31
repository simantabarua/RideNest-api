import z from "zod";
import { IsActive, Role } from "./user.interface";

const nameSchema = z
  .string({ message: "Name must be a string" })
  .min(2, { message: "Name must be at least 2 characters long." })
  .max(50, { message: "Name cannot exceed 50 characters." });

const emailSchema = z
  .string({ message: "Email is required" })
  .min(5, { message: "Email must be at least 5 characters long." })
  .max(100, { message: "Email cannot exceed 100 characters." })
  .refine((val) => !!val, {
    message: "Invalid email address format.",
  });

const passwordSchema = z
  .string({ message: "Password must be a string" })
  .min(8, { message: "Password must be at least 8 characters long." })
  .regex(/^(?=.*[A-Z])/, {
    message: "Password must contain at least 1 uppercase letter.",
  })
  .regex(/^(?=.*[!@#$%^&*])/, {
    message: "Password must contain at least 1 special character.",
  })
  .regex(/^(?=.*\d)/, {
    message: "Password must contain at least 1 number.",
  });

const phoneSchema = z
  .string({ message: "Phone Number must be a string" })
  .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
    message:
      "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
  });

const addressSchema = z
  .string({ message: "Address must be a string" })
  .max(200, { message: "Address cannot exceed 200 characters." });

export const createUserZodSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  phone: phoneSchema.optional(),
  address: addressSchema.optional(),
});

export const updateUserZodSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  password: passwordSchema.optional(),
  phone: phoneSchema.optional(),
  role: z.enum(Object.values(Role) as [string]).optional(),
  isActive: z.enum(Object.values(IsActive) as [string]).optional(),
  isDeleted: z
    .boolean({ message: "isDeleted must be true or false" })
    .optional(),
  isVerified: z
    .boolean({ message: "isVerified must be true or false" })
    .optional(),
  isApproved: z
    .boolean({ message: "isApproved must be true or false" })
    .optional(),
  isAvailable: z
    .boolean({ message: "isAvailable must be true or false" })
    .optional(),
  isBlocked: z
    .boolean({ message: "isBlocked must be true or false" })
    .optional(),
  isOnline: z.boolean({ message: "isOnline must be true or false" }).optional(),
  address: addressSchema.optional(),
  picture: z.string().optional().or(z.literal("")).optional(),
});
