import { prisma } from "@/app/lib/clients";
import { getSessionUser } from "../../lib/session";

export async function GET(request: Request) {
  const user = await getSessionUser();
  return new Response(JSON.stringify(user));
}

export async function PUT(request: Request) {
  const { username, email, firstName, lastName } = await request.json();
  await prisma.user.update({
    where: { username },
    data: { email, firstName, lastName },
  });
}
