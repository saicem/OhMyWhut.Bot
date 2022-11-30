import {PrismaClient} from "@prisma/client";
import LRUCache from "lru-cache";

const prisma = new PrismaClient();

export type UserPublicInfo = { username: string | null, password: string | null, meterId: string | null } | null

const lruCache = new LRUCache<number, UserPublicInfo>({
  max: 128,
  ttl: 48 * 60 * 60 * 1000,
});

class DbHandler {
  async setUserAccount(qq: number, username: string, password: string) {
    lruCache.delete(qq);
    await prisma.user.upsert({
      create: {
        qq: qq.toString(),
        username: username,
        password: password,
      },
      update: {
        username: username,
        password: password,
      },
      where: {
        qq: qq.toString(),
      },
    });
  }

  async setUserRoom(qq: number, meter: string) {
    lruCache.delete(qq);
    await prisma.user.upsert({
      create: {
        qq: qq.toString(),
        meterId: meter,
      },
      update: {
        meterId: meter,
      },
      where: {
        qq: qq.toString(),
      },
    });
  }

  async getUser(qq: number) {
    let ret = lruCache.get(qq);
    if (ret == undefined) {
      ret = await prisma.user.findFirst({
        where: {
          qq: qq.toString(),
        },
        select: {
          username: true,
          password: true,
          meterId: true,
        },
      });
      lruCache.set(qq, ret);
    }
    return ret;
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
