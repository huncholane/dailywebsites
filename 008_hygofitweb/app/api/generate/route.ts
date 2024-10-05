import { messageTemplate, SCHEMAS } from "@/lib/schemas";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod.mjs";

export const maxDuration = 60;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
  console.log("Using version", version);

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
