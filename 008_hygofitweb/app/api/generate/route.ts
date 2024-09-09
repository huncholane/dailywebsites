import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { z } from "zod";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SCHEMA = z.array(
  z.object({
    name: z.string(),
    sets: z.array(
      z.object({
        reps: z.number().int(),
      })
    ),
  })
);

export async function POST(request: Request) {
  const contentType = request.headers.get("Content-Type");

  let athlete, muscleGroups, duration;

  if (contentType === "application/json") {
    const data = await request.json();
    athlete = data.athlete;
    muscleGroups = data.muscleGroups;
    duration = data.duration;
  } else if (contentType === "application/x-www-form-urlencoded") {
    const formData = await request.formData();
    athlete = formData.get("athlete");
    muscleGroups = formData.get("muscleGroups");
    duration = formData.get("duration");
  } else {
    throw new Error("Unsupported content type");
  }

  const muscleGroupsString = muscleGroups.join(", ");
  console.log(OPENAI_API_KEY);
  const message = `Please create a workout in the style of ${athlete} with the following muscle groups: ${muscleGroupsString} that will take duration of ${duration} minutes to complete. Return a list of exercises in json format.`;
  const openaiResponse = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: zodResponseFormat(SCHEMA, "exercises"),
    messages: [
      {
        role: "system",
        content: "Please create exercises in json format.",
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
  console.log(content);
  return new Response(JSON.stringify(content), {
    headers: {
      "content-type": "application/json",
    },
  });
}

export async function GET() {
  return new Response("Hello World!");
}
