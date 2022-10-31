import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

class DbHandler {
  async setUserAccount(qq: string, username: string, password: string) {
    await prisma.user.upsert({
      create: {
        qq: qq,
        username: username,
        password: password,
      },
      update: {
        username: username,
        password: password,
      },
      where: {
        qq: qq,
      },
    });
  }

  async setUserRoom(qq: string, meter: string) {
    await prisma.user.upsert({
      create: {
        qq: qq,
        meterId: meter,
      },
      update: {
        meterId: meter,
      },
      where: {
        qq: qq,
      },
    });
  }

  async getUserAccount(qq: string) {
    return await prisma.user.findFirst({
      where: {
        qq: qq,
      },
      select: {
        username: true,
        password: true,
      },
    });
  }

  async getUserMeter(qq: string) {
    return await prisma.user.findFirst({
      where: {
        qq: qq,
      },
      select: {
        username: true,
        password: true,
        meterId: true,
      },
    });
  }

  async getMeterIdFromRoom(room: string) {
    return await prisma.room.findFirst({
      where: {
        room: room,
      },
      select: {
        meterId: true,
      },
    });
  }
}

export const db = new DbHandler();
