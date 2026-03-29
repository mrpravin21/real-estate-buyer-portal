import { z } from "zod";

export const favouriteBodySchema = z.object({
  propertyId: z.string().uuid("Invalid property id"),
});
