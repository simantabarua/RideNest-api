import { z } from "zod";
import { RideStatus } from "../ride/ride.interface";

export const availabilitySchema = z.object({
  isOnline: z.boolean(),
});

export const rideStatusSchema = z.object({
  status: z.enum(Object.values(RideStatus) as [string]),
});
