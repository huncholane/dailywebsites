import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const settings = await prisma.setting.findMany();
  return new Response(JSON.stringify(settings));
}

export async function POST(request: Request) {
  const settings = await request.json();
  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {
        value: setting.value,
        updatedAt: new Date(),
      },
      create: {
        key: setting.key,
        value: setting.value,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }
  return new Response("Settings created", { status: 201 });
}
