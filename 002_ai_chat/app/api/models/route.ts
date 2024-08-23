import { Ollama } from "ollama";

const ollama = new Ollama();

export async function GET(request: Request) {
  const data = await ollama.list();
  return new Response(JSON.stringify(data.models));
}
