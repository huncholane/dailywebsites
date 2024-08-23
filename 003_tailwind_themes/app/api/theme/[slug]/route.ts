import { prisma } from "@/app/clients";
import { Theme } from "@prisma/client";

type Params = {
  slug: string;
};

export async function GET(request: Request, context: { params: Params }) {
  const { slug } = context.params;
  const theme = await prisma.theme.findUnique({
    where: { slug },
  });
  return new Response(JSON.stringify(theme));
}

export async function PUT(request: Request, context: { params: Params }) {
  const { slug } = context.params;
  const data = await request.json();
  await prisma.theme.update({
    where: { slug },
    data,
  });
  return new Response(
    JSON.stringify({ message: "Theme updated successfully" }),
    { status: 200 }
  );
}

export async function DELETE(request: Request) {}
