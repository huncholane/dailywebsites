import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const timeSlots = await prisma.timeSlot.findMany();
  return Response.json(timeSlots);
}

export async function POST(req: Request) {
  const data = await req.json();
  var timeSlot;
  if (data.id === 0) {
    const startTime = new Date();
    timeSlot = await prisma.timeSlot.create({
      data: { startTime, description: data.task },
    });
    console.log(`Created new time slot: ${timeSlot.id}`);
  } else {
    const endTime = new Date();
    timeSlot = await prisma.timeSlot.update({
      where: {
        id: data.id,
      },
      data: {
        endTime,
        description: data.task,
      },
    });
    console.log(`Updated time slot: ${timeSlot.id}`);
  }
  return Response.json(timeSlot);
}
