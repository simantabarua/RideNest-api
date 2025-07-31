import { z } from "zod";
import { RideStatus } from "./ride.interface";

export const createRideSchema = z.object({
  pickupLocation: z.string(),
  destinationLocation: z.string(),
});

export const updateRideSchema = z.object({
  status: z.enum(Object.values(RideStatus) as [string]),
  driver: z.string().optional(),
  fare: z.number().optional(),
});
