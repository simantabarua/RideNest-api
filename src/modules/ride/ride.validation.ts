import { z } from "zod";
import { RideStatus } from "./ride.interface";

export const createRideSchema = z.object({
  pickupLocation: z
    .string({ message: "Pickup location is required." })
    .min(1, { message: "Pickup location cannot be empty." }),

  destinationLocation: z
    .string({ message: "Destination location is required." })
    .min(1, { message: "Destination location cannot be empty." }),

  fare: z
    .number({ message: "Fare must be a number." })
    .nonnegative({ message: "Fare must be a non-negative value." }),
});

export const updateRideSchema = z.object({
  status: z.enum(Object.values(RideStatus) as [string], {
    message: "Invalid ride status value.",
  }),

  driver: z.string({ message: "Driver ID must be a string." }).optional(),

  fare: z
    .number({ message: "Fare must be a number." })
    .nonnegative({ message: "Fare must be a non-negative value." })
    .optional(),
});
