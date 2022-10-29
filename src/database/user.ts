import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export async function setUserAccount(qq: number, username: string, password: string) {
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

export async function setUserRoom(qq: number, meter: string) {
  await prisma.user.upsert({
    create: {
      qq: qq,
      meter: meter,
    },
    update: {
      meter: meter,
    },
    where: {
      qq: qq,
    },
  });
}

export async function getUserAccount(qq: number) {
  return await prisma.user.findFirst({
    where: {
      qq: qq,
    },
    select: {
      username: true,
      password: true,
      meter: true,
    },
  });
}

export async function getUserMeter(qq: number) {
  return await prisma.user.findFirst({
    where: {
      qq: qq,
    },
    select: {
      username: true,
      password: true,
      meter: true,
    },
  });
}
