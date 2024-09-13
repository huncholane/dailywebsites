import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SET_LIST_DESCRIPTION = `A collection of exercise sets defined by the following set structures:

- Pyramid Set: Only involves one exercise, starting with lighter weights and higher reps, progressing to heavier weights and fewer reps.
- Reverse Pyramid Set: Only involves one exercise. Begins with the heaviest weight and lowest reps, then reduces weight and increases reps in subsequent sets.
- Drop Set: Only involves one exercise. After reaching failure with a certain weight, the weight is decreased and the exercise is continued without rest.
- Super Slow Set: Focuses on very slow repetitions to increase time under tension, typically with a single set of an exercise.
- Cluster Set: A single exercise is performed in smaller clusters with short rest periods in between, allowing for heavier weights.
- Rest-Pause Set: A set performed to failure, followed by short rests before continuing the same exercise with the same weight.
- 21s (Partial Reps): Involves partial and full reps, typically 7 reps in the lower range, 7 in the upper range, and 7 full reps, for a total of 21 reps.
- Straight Set: Consists of a consistent number of reps and sets for one exercise, without changing the weight or rep scheme.
- Superset: Two exercises are performed back-to-back without rest in between, either targeting the same or opposing muscle groups.
- Giant Set: Four or more exercises are performed consecutively with minimal rest, usually targeting the same muscle group.
- Heavy Set: A single set of one exercise performed with a heavy weight, typically for lower reps.
- Light Set: A single set of one exercise performed with a light weight, typically for higher reps.`;

const SCHEMAS = [
  z.object({
    data: z.array(
      z.object({
        name: z.string(),
        sets: z.array(z.number().int()),
      })
    ),
  }),
  z.object({
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
  }),
  z.object({
    difficulty: z.string(),
    name: z.string(),
    inspiration: z.string(),
    durationMinutes: z
      .number()
      .int()
      .describe("The sum of the duration of all exercise groups in minutes"),
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
                .describe(
                  "Make the number of reps 69 if it is meant to go to failure"
                ),
              unit: z.enum(["reps", "seconds"]),
              restSeconds: z
                .number()
                .int()
                .describe("The rest time in seconds. 0 if no rest"),
              weight: z.string(),
              notes: z.string(),
            })
          )
          .describe(SET_LIST_DESCRIPTION),
      })
    ),
  }),
];

const messageTemplate = `Please create a json list of exercise groups.
The exercise group should have a difficultyRating difficulty level.
Study workouts tagged with athlete and create a workout a inspired by the style of athlete. 
Please take into account set structures like Pyramid Set, Reverse Pyramid Set, Drop Set, Super Slow Set, Cluster Set, Rest-Pause Set, 21s (Partial Reps), Straight Set, Superset, Giant Set.
Make sure the sum of durationMinutes for all exercises adds up to DURATION minutes.
The workout should target the following muscle groups: muscleGroups.`;

export async function POST(request: Request) {
  const contentType = request.headers.get("Content-Type");

  let athlete, muscleGroups, duration, version, difficulty;

  if (contentType === "application/json") {
    const data = await request.json();
    athlete = data.athlete;
    muscleGroups = data.muscleGroups;
    duration = data.duration;
    version = data.version || 1;
    difficulty = data.difficulty;
  } else if (contentType === "application/x-www-form-urlencoded") {
    const formData = await request.formData();
    athlete = formData.get("athlete");
    muscleGroups = formData.get("muscleGroups");
    duration = formData.get("duration");
    version = formData.get("version") || 1;
    difficulty = formData.get("difficulty");
  } else {
    throw new Error("Unsupported content type");
  }

  const schema = SCHEMAS[version - 1];

  const muscleGroupsString = muscleGroups.join(", ");
  const message = messageTemplate
    .replace("athlete", athlete)
    .replace("muscleGroups", muscleGroupsString)
    .replace("DURATION", duration)
    .replace("difficultyRating", difficulty);
  console.log(message);

  const openaiResponse = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: zodResponseFormat(schema, "exercises"),
    messages: [
      {
        role: "system",
        content: `You have studied the style of ${athlete} and are creating a workout inspired by their style.`,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: message,
          },
        ],
      },
    ],
  });
  const content = openaiResponse.choices[0].message.content;

  // Log the duration vs the sum of the exercise durations
  if (content) {
    try {
      const data = JSON.parse(content);
      const actualDuration = data.data.reduce(
        (acc: number, group: { durationMinutes: number }) => {
          return acc + group.durationMinutes;
        },
        0
      );
      console.log(
        `Actual duration: ${actualDuration}, Expected duration: ${duration}`
      );
    } catch {}
  }

  return new Response(content, {
    headers: {
      "content-type": "application/json",
    },
  });
}

export async function GET() {
  return new Response("Hello World!");
}
