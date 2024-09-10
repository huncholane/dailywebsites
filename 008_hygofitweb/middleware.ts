import { prisma } from "./prisma";

const deviceMiddleware = async (req: Request) => {
  const headers = new Headers(req.headers);
  const id = headers.get("Device-ID");

  if (id) {
    prisma.device.upsert({ where: { id }, update: {}, create: { id } });
  }
};

export default deviceMiddleware;
