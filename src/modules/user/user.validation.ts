import { z } from "zod";

export const nameSchema = z
  .string({ message: "Name is required." })
  .min(2, { message: "Name must be at least 2 characters long." })
  .max(50, { message: "Name cannot exceed 50 characters." })
  .regex(/^[A-Za-z\s]+$/, {
    message: "Name can only contain letters and spaces.",
  });

export const emailSchema = z
  .string({ message: "Email is required." })
  .min(5, { message: "Email must be at least 5 characters long." })
  .max(100, { message: "Email cannot exceed 100 characters." })
  .toLowerCase()
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address");

export const passwordSchema = z
  .string({ message: "Password is required." })
  .min(8, { message: "Password must be at least 8 characters long." })
  .regex(/(?=.*[A-Z])/, {
    message: "Password must contain at least one uppercase letter.",
  })
  .regex(/(?=.*[!@#$%^&*])/, {
    message: "Password must contain at least one special character.",
  })
  .regex(/(?=.*\d)/, {
    message: "Password must contain at least one number.",
  });

export const phoneSchema = z
  .string({ message: "Phone number must be a string." })
  .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
    message:
      "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX.",
  });

export const addressSchema = z
  .string({ message: "Address must be a string." })
  .max(200, { message: "Address cannot exceed 200 characters." });

export const createUserZodSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    phone: phoneSchema.optional(),
    address: addressSchema.optional(),
  })
  .strict();

export const updateUserZodSchema = z
  .object({
    name: nameSchema.optional(),
    email: emailSchema.optional(),
    password: passwordSchema.optional(),
    phone: phoneSchema.optional(),
    address: addressSchema.optional(),
    picture: z.string().optional().or(z.literal("")).optional(),
  })
  .strict();
