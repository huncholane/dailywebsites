"use server";
import bcrypt from "bcrypt";
import { prisma } from "../clients";
import { createSession } from "../session";

export const login = async (email: string, password: string) => {
  // Fetch the user from the database
  var user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    user = await prisma.user.findUnique({ where: { username: email } });
  }

  if (!user) {
    throw new Error("User not found");
  }

  // Compare the provided password with the stored hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  // Create the session
  await createSession(user.id);
};
