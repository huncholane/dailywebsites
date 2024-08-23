import { PrismaClient } from "@prisma/client";
import { OpenAI } from "openai";
console.log(process.env.OPENAI_KEY);

export const prisma = new PrismaClient();
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});
