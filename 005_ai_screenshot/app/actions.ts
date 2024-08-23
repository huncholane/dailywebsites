"use server";
import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "./auth/clients";
import { getFullSessionUser, getSessionUser } from "./auth/session";
import { Formatter } from "@prisma/client";
import { createHash } from "crypto";
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod.mjs";

export async function loadFormatters() {
  const user = await getSessionUser();
  if (!user) return [];
  return prisma.formatter.findMany({
    where: { userId: user.id },
  });
}

export async function createFormatterBackend(
  userId: string,
  name: string,
  fields: string[]
) {
  const previousFormatter = await prisma.formatter.findFirst({
    where: {
      name,
      userId,
    },
  });
  if (previousFormatter) {
    return prisma.formatter.update({
      where: {
        id: previousFormatter.id,
      },
      data: {
        fields,
      },
    });
  } else {
    return prisma.formatter.create({
      data: {
        name,
        fields,
        userId,
      },
    });
  }
}

export async function loadDbExtractions(formatterId: string) {
  return prisma.extraction.findMany({
    where: { formatterId },
  });
}

export async function deleteFormatterBackend(formatterId: string) {
  await prisma.extraction.deleteMany({
    where: { formatterId },
  });

  return prisma.formatter.delete({
    where: { id: formatterId },
  });
}

export async function createExtractionBackend(
  formatter: Formatter,
  formData: FormData
) {
  const blob = formData.get("image") as Blob;
  const user = await getFullSessionUser();
  if (!user?.openAiKey) throw new Error("OpenAI key not found.");
  const openai = new OpenAI({ apiKey: user?.openAiKey });
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const imageHash = createHash("sha256").update(buffer).digest("hex");

  const base64Image = buffer.toString("base64");

  const previousExtraction = await prisma.extraction.findFirst({
    where: {
      formatterId: formatter.id,
      image: imageHash,
    },
  });

  const schemaPrep = {} as any;
  for (const field of formatter.fields) {
    schemaPrep[field] = z.string();
  }
  const schema = z.object(schemaPrep);

  const fieldsString = formatter.fields.join(", ");

  const vision = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: zodResponseFormat(schema, formatter.name),
    messages: [
      {
        role: "system",
        content: "Please extract the json data from the image:",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Please extract the following fields from the image: ${fieldsString}`,
          },
          {
            type: "image_url",
            image_url: { url: `data:image/png;base64,${base64Image}` },
          },
        ],
      },
    ],
  });
  const content = vision.choices[0].message.content;
  if (!content) {
    throw new Error("Failed to extract data from the image.");
  }

  const data = JSON.parse(content);
  console.log(data);

  let hasValue = false;
  for (const field of formatter.fields) {
    if (data[field]) {
      hasValue = true;
      break;
    }
  }

  if (!hasValue) {
    throw new Error("Failed to extract data from the image.");
  }

  if (previousExtraction) {
    return prisma.extraction.update({
      where: {
        id: previousExtraction.id,
      },
      data: {
        data,
      },
    });
  } else {
    return prisma.extraction.create({
      data: {
        formatterId: formatter.id,
        image: imageHash,
        data: data,
      },
    });
  }
}

export async function deleteExtractionBackend(extractionId: string) {
  return prisma.extraction.delete({
    where: { id: extractionId },
  });
}
