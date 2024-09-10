import apns2 from "@/clients/apns2";
import { prisma } from "@/prisma";
import { Notification } from "apns2";

export async function POST(request: Request) {
  const { message } = await request.json();
  const devices = await prisma.device.findMany();
  const notifications = devices.map((device) => {
    return new Notification(device.id, { alert: message, badge: 1 });
  });
  apns2.sendMany(notifications);
  console.log(devices);
  const deviceIds = devices.map((device) => device.id);
  return new Response(JSON.stringify({ deviceIds }));
}
