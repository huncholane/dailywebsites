import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SCHEMA1 = z.object({
  data: z.array(
    z.object({
      name: z.string(),
      sets: z.array(z.number().int()),
    })
  ),
});

const SCHEMA2 = z.object({
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

const messageTemplate = `Please create a json list of exercises.
Each exercise should have at least 3 sets.
Study workouts tagged with athlete and create a workout a inspired by the style of athlete.
The workout should target the following muscle groups: muscleGroups.
The workout should take no more than duration minutes to complete.`;

export async function POST(request: Request) {
  const contentType = request.headers.get("Content-Type");

  let athlete, muscleGroups, duration, version;

  if (contentType === "application/json") {
    const data = await request.json();
    athlete = data.athlete;
    muscleGroups = data.muscleGroups;
    duration = data.duration;
    version = data.version || 1;
  } else if (contentType === "application/x-www-form-urlencoded") {
    const formData = await request.formData();
    athlete = formData.get("athlete");
    muscleGroups = formData.get("muscleGroups");
    duration = formData.get("duration");
    version = formData.get("version") || 1;
  } else {
    throw new Error("Unsupported content type");
  }

  let schema;
  if (version === 1) {
    schema = SCHEMA1;
  } else if (version === 2) {
    schema = SCHEMA2;
  } else {
    throw new Error("Unsupported version");
  }

  const muscleGroupsString = muscleGroups.join(", ");
  const message = messageTemplate
    .replace("athlete", athlete)
    .replace("muscleGroups", muscleGroupsString)
    .replace("duration", duration);
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
