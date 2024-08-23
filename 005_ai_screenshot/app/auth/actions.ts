"use server";
import { prisma } from "./clients";
import { getSessionUser } from "./session";

export async function updateUser(formData: FormData) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) throw new Error("No user session found.");
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const openAiKey = formData.get("openAiKey") as string;
  const user = await prisma.user.update({
    where: { id: sessionUser.id },
    data: {
      username,
      email,
      firstName,
      lastName,
      openAiKey,
    },
  });
}
