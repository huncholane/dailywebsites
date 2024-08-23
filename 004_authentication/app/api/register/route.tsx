import { prisma } from "@/app/lib/clients";
import { createSession } from "@/app/lib/session";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  const { username, password, email } = await request.json();

  // Hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Store the user in the database
  var user;
  try {
    user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "User already exists" }), {
      status: 409,
      headers: { "Content-Type": "application/json" },
    });
  }

  createSession(user.id);

  return new Response(JSON.stringify("Successfully created user!"), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
