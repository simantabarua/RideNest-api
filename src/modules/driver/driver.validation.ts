import { z } from "zod";
import { VehicleType } from "../vehicle/vehicle.interface";

export const setAvailabilitySchema = z.object({
  isAvailable: z.boolean(),
});

export const vehicleInfoSchema = z.object({
  type: z.enum(Object.values(VehicleType) as [string]).optional(),
  model: z.string(),
  registrationNumber: z.string(),
});

export const updateDriverZodSchema = z.object({
  licenseNumber: z.string().optional(),
  vehicleInfo: vehicleInfoSchema.optional(),
  rating: z.number().nonnegative().optional(),
  earning: z.number().nonnegative().optional(),
  completedRides: z.number().nonnegative().optional(),
  isAvailable: z.boolean().optional(),
});
