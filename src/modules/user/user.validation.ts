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
    confirmPassword: z.string(),
    phone: phoneSchema.optional(),
    address: addressSchema.optional(),
    agreeToTerms: z.boolean().optional(),
    agreeToMarketing: z.boolean().optional(),
  })
  .strict();

export const updateUserZodSchema = z
  .object({
    name: nameSchema.optional(),
    email: emailSchema.optional(),
    currentPassword: passwordSchema.optional(),
    newPassword: passwordSchema.optional(),
    confirmPassword: z.string().optional(),
    phone: phoneSchema.optional(),
    address: addressSchema.optional(),
    picture: z.string().optional().or(z.literal("")).optional(),
    driverInfo: z.string().optional(),
    riderInfo: z.string().optional(),
    role: z.enum(["USER", "DRIVER", "ADMIN"]).optional(),
    licenseNumber: z.string().optional(),
    emergencyContacts: z
      .array(
        z.object({
          name: z.string(),
          relation: z.string(),
          phone: z.string().optional(),
          email: z.string().optional(),
          isPrimary: z.boolean().optional(),
        })
      )
      .optional(),
    vehicleInfo: z
      .object({
        type: z.string(),
        model: z.string(),
        registrationNumber: z.string(),
      })
      .optional(),
  })
  .strict();
