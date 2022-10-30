import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export async function setUserAccount(qq: string, username: string, password: string) {
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

export async function setUserRoom(qq: string, meter: string) {
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

export async function getUserAccount(qq: string) {
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

export async function getUserMeter(qq: string) {
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
