import { ChatRequest, Ollama } from "ollama";

const ollama = new Ollama();

export async function GET(request: Request) {}

export async function POST(request: Request) {
  const data: ChatRequest = await request.json();
  const response = await ollama.chat({ ...data, stream: false });
  return new Response(JSON.stringify(response));
}
