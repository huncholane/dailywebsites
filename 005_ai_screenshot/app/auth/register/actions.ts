"use server";
import { prisma } from "../clients";
import { createSession } from "../session";
import bcrypt from "bcrypt";

export const register = async (
  username: string,
  email: string,
  password: string
) => {
  // Hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Store the user in the database
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });
  await createSession(user.id);
};
