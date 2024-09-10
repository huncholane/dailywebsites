import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SCHEMA = z.object({
  data: z.array(
    z.object({
      name: z.string(),
      sets: z.array(z.number().int()),
    })
  ),
});

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
  const message = `Please create a workout in the style of ${athlete} with the following muscle groups: ${muscleGroupsString} that will take no more than ${duration} minutes to complete assuming it takes 3-5 minutes to complete one set depending on the difficulty of each exercise. Return a list of exercises in json format. Each exersie has a name and list of sets with reps.`;
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
  return new Response(content, {
    headers: {
      "content-type": "application/json",
    },
  });
}

export async function GET() {
  return new Response("Hello World!");
}
