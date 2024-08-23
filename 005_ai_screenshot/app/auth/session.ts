"use server";
import { cookies } from "next/headers";
import { prisma } from "./clients";

import crypto from "crypto";
import { create } from "zustand";
import { useSessionUserStore } from "../auth/store";
import { User } from "@prisma/client";

const algorithm = "aes-256-cbc";
const base64Key = process.env.SESSION_SECRET as string;
const secretKey = Buffer.from(base64Key, "base64");
const iv = crypto.randomBytes(16);

export type SessionData = {
  sessionId: string;
  expiresAt: Date;
};

export type SessionCookie = {
  iv: string;
  encryptedData: string;
};

export type SessionUser = {
  id: string;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
};

export async function encrypt(data: SessionData): Promise<SessionCookie> {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

  let encrypted = cipher.update(JSON.stringify(data), "utf8", "hex");
  encrypted += cipher.final("hex");

  return {
    iv: iv.toString("hex"),
    encryptedData: encrypted,
  };
}

export async function decrypt(
  encryptedData: string,
  iv: string
): Promise<SessionData> {
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(iv, "hex")
  );

  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return JSON.parse(decrypted);
}

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // 1. Create a session in the database
  const data = await prisma.session.create({ data: { userId } });
  const sessionId = data.id;

  // 2. Encrypt the session ID
  const session = await encrypt({ sessionId, expiresAt });

  // 3. Store the session in cookies for optimistic auth checks
  cookies().set("session", JSON.stringify(session), {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession() {
  const cookie = cookies().get("session");
  if (!cookie) return null;
  const { encryptedData, iv } = JSON.parse(cookie.value);
  const { sessionId, expiresAt } = await decrypt(encryptedData, iv);
  if (new Date() > new Date(expiresAt)) return null;
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  });
  return session;
}

export async function getFullSessionUser(): Promise<User | null> {
  const session = await getSession();
  if (!session) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });
  return user;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getSession();
  if (!session) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });
  if (!user)
    return {
      id: "",
      username: "",
      email: "",
      firstName: null,
      lastName: null,
    };
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };
}

export async function userStoreMiddleware() {
  const storedUser = useSessionUserStore.getState().user;
  if (!storedUser) {
    const user = await getSessionUser();
    useSessionUserStore.getState().setUser(user);
  }
}
