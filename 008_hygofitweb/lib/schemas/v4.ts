import { z } from "zod";

export const SET_LIST_DESCRIPTION = `A collection of exercise sets defined by the following set structures:

- Pyramid Set: Only involves one exercise, starting with lighter weights and higher reps, progressing to heavier weights and fewer reps. The list will only have one exercise.
- Reverse Pyramid Set: Only involves one exercise. Begins with the heaviest weight and lowest reps, then reduces weight and increases reps in subsequent sets. The list will only have one exercise.
- Drop Set: Only involves one exercise. After reaching failure with a certain weight, the weight is decreased and the exercise is continued without rest. The list will only have one exercise.
- Super Slow Set: Focuses on very slow repetitions to increase time under tension, typically with a single set of an exercise. There will only be one set.
- Cluster Set: A single exercise is performed in smaller clusters with short rest periods in between, allowing for heavier weights. There will only be one set.
- Rest-Pause Set: A set performed to failure, followed by short rests before continuing the same exercise with the same weight. There will only be one set.
- 21s (Partial Reps): Involves partial and full reps, typically 7 reps in the lower range, 7 in the upper range, and 7 full reps, for a total of 21 reps. There will only be one set.
- Straight Set: Consists of a consistent number of reps and sets for one exercise, without changing the weight or rep scheme. There will only be one set.
- Superset: Two exercises are performed back-to-back without rest in between, either targeting the same or opposing muscle groups. There will be two exercises.
- Giant Set: Four or more exercises are performed consecutively with minimal rest, usually targeting the same muscle group. There will be multiple exercises.
- Heavy Set: A single set of one exercise performed with a heavy weight, typically for lower reps. There will only be one set.
- Light Set: A single set of one exercise performed with a light weight, typically for higher reps. There will only be one set.`;

export const v4 = z.object({
  difficulty: z.string(),
  name: z.string(),
  inspiration: z.string(),
  durationMinutes: z
    .number()
    .int()
    .describe(
      "The total duration of all the exercise groups in minutes. The durationMinutes of all exercise groups must add up exactly to this value."
    ),
  data: z.array(
    z.object({
      name: z.string().describe("A creative name for the exercise group"),
      setStructure: z.enum([
        "Pyramid Set",
        "Reverse Pyramid Set",
        "Drop Set",
        "Super Slow Set",
        "Cluster Set",
        "Rest-Pause Set",
        "21s (Partial Reps)",
        "Straight Set",
        "Superset",
        "Giant Set",
        "Heavy Set",
        "Light Set",
      ]),
      description: z.string(),
      difficulty: z.string(),
      durationMinutes: z
        .number()
        .int()
        .describe("The duration of the exercise group in minutes"),
      sets: z
        .array(
          z.object({
            exercise: z.string(),
            reps: z
              .number()
              .int()
              .nullable()
              .describe(
                "The number of reps in the current set. Set to null if the set goes to failure."
              ),
            unit: z.enum(["reps", "seconds"]),
            restSeconds: z
              .number()
              .int()
              .describe(
                "The rest time in seconds. 0 if no rest. Only the last set should have a rest on supersets, giant sets, and drop sets."
              ),
            weight: z.enum(["light", "medium", "heavy", "max", "bodyweight"]),
            notes: z.string(),
          })
        )
        .describe(SET_LIST_DESCRIPTION),
    })
  ),
});
