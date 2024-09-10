import { prisma } from "@/prisma";

export async function POST(request: Request) {
  const { id } = await request.json();
  await prisma.device.upsert({ where: { id }, update: {}, create: { id } });
  return new Response("Device registered");
}
