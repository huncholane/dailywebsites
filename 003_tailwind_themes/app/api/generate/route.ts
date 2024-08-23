import { openai } from "@/app/clients";
import ollama from "ollama";

const isHexColor = (color: string) => /^#([0-9A-F]{3}){1,2}$/i.test(color);

const keys = [
  "primary",
  "primaryLight",
  "primaryDark",
  "secondary",
  "secondaryLight",
  "secondaryDark",
  "accent",
  "accentLight",
  "accentDark",
  "background",
  "backgroundLight",
  "backgroundDark",
  "text",
  "textLight",
  "textDark",
  "border",
  "borderLight",
  "borderDark",
];

const keysString = keys.join(", ");

const systemMessage = `You are a color theme expert. The response will be in json format as follows. It will have the key and the color value in hex format. Use the following keys: primary, primaryLight, primaryDark, secondary, secondaryLight, secondaryDark, accent, accentLight, accentDark, background, backgroundLight, backgroundDark, text, textLight, textDark, border, borderLight, borderDark.`;

const validateApiTheme = (theme: any) => {
  for (const key of [
    "primary",
    "primaryLight",
    "primaryDark",
    "secondary",
    "secondaryLight",
    "secondaryDark",
    "accent",
    "accentLight",
    "accentDark",
    "background",
    "backgroundLight",
    "backgroundDark",
    "text",
    "textLight",
    "textDark",
    "border",
    "borderLight",
    "borderDark",
  ]) {
    if (!theme[key] || !isHexColor(theme[key])) {
      return false;
    }
  }
};

const createOllamaResponse = async (description: string, model: string) => {
  const response = await ollama.chat({
    model,
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      {
        role: "user",
        content: `Generate a color theme given the following description: ${description}`,
      },
    ],
    format: "json",
  });
  var responseJson;
  try {
    responseJson = JSON.parse(response.message.content);
  } catch (error) {
    return new Response("Failed to parse the response from the AI.", {
      status: 500,
    });
  }
  return new Response(JSON.stringify(responseJson), {
    status: 201,
  });
};

const createOpenAIResponse = async (description: string, model: string) => {
  console.log();
  try {
    const message = `Please generate a color theme given the following description: ${description}`;
    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: message },
      ],
      response_format: { type: "json_object" },
    });
    const responseJson = response.choices[0].message.content;
    return new Response(responseJson, { status: 201 });
  } catch (error) {
    console.error("Error fetching response from OpenAI:", error);
    return new Response("Failed to get a response from OpenAI.", {
      status: 500,
    });
  }
};

export async function POST(request: Request) {
  var { description, model, system } = await request.json();
  if (!system) system = "openai";
  if (system === "ollama") {
    if (!model) model = "mistral:latest";
    const response = await createOllamaResponse(description, model);
    return response;
  } else if (system === "openai") {
    // Handle OpenAI response here
    if (!model) model = "gpt-4o";
    const response = await createOpenAIResponse(description, model);
    return response;
  }
}
