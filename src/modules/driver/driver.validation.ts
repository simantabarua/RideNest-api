import { z } from "zod";

export const setAvailabilitySchema = z.object({
  isOnline: z.boolean(),
});
