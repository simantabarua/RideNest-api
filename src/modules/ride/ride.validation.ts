import { z } from "zod";

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
