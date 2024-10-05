import { z } from "zod";

export const v1 = z.object({
  data: z.array(
    z.object({
      name: z.string(),
      sets: z.array(z.number().int()),
    })
  ),
});
