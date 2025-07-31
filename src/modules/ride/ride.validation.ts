import { z } from "zod";

export const rideRequestSchema = z.object({
  pickupLocation: z.string(),
  destinationLocation: z.string(),
});
