import {prisma} from "./user.js";

export async function getMeterIdFromRoom(room: string) {
  return await prisma.room.findFirst({
    where: {
      room: room,
    },
    select: {
      meterId: true,
    },
  });
}
