import { z } from "zod";

export const v2 = z.object({
  data: z.array(
    z.object({
      name: z.string(),
      sets: z.array(
        z.object({
          reps: z.number().int(),
          unit: z.string(),
          restSeconds: z.number().int(),
          weight: z.string(),
        })
      ),
    })
  ),
});
