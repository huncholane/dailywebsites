import { prisma } from "@/app/clients";
import { Theme } from "@prisma/client";
import slugify from "slugify";

export async function GET(request: Request) {
  const themes = await prisma.theme.findMany();
  return new Response(JSON.stringify(themes));
}

export async function POST(request: Request) {
  const data: Theme = await request.json();
  try {
    await prisma.theme.create({
      data,
    });
    return new Response("Successfully created the Theme.", { status: 201 });
  } catch (error) {
    return new Response("Failed to create the Theme.", { status: 500 });
  }
}
