import { prisma } from "@/app/lib/clients";
import { createSession } from "@/app/lib/session";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  // Fetch the user from the database
  var user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    user = await prisma.user.findUnique({ where: { username: email } });
  }

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Compare the provided password with the stored hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return new Response(JSON.stringify({ error: "Invalid password" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Create the session
  await createSession(user.id);

  // Return a success response (you might want to include a token or session management here)
  return new Response(JSON.stringify({ message: "Login successful" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
