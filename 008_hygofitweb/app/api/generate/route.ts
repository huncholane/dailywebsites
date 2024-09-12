import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
    durationMinutes: z.number().int(),
    data: z.array(
      z.object({
        name: z.string(),
        setStructure: z.string(),
        description: z.string(),
        difficulty: z.string(),
        durationMinutes: z.number().int(),
        sets: z.array(
          z.object({
            exercise: z.string(),
            reps: z.number().int(),
            unit: z.string(),
            restSeconds: z.number().int(),
            weight: z.string(),
            notes: z.string(),
          })
        ),
      })
    ),
  }),
];

const messageTemplate = `Please create a json list of exercise groups.
The exercise group should have a difficultyRating difficulty level.
Study workouts tagged with athlete and create a workout a inspired by the style of athlete. 
Please take into account set structures like Pyramid Set, Reverse Pyramid Set, Drop Set, Super Slow Set, Cluster Set, Rest-Pause Set, 21s (Partial Reps), Straight Set, Superset, Giant Set.
Assume each set takes 1 minute plus the rest period to complete.
The workout should target the following muscle groups: muscleGroups.
The workout should take no more than duration minutes to complete.`;

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
    .replace("duration", duration)
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
  return new Response(content, {
    headers: {
      "content-type": "application/json",
    },
  });
}

export async function GET() {
  return new Response("Hello World!");
}
